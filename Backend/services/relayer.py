import asyncio
import base64
import hashlib
import hmac
import json
import secrets
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Deque, Dict, Optional, Tuple

from eth_account import Account
from eth_account.messages import encode_typed_data
from fastapi import HTTPException
from web3 import Web3
from web3.exceptions import ContractLogicError

import config
from schemas import RelayRequest, RelayResponse

_DEPLOYMENT_FILE = Path(__file__).resolve().parents[2] / "Contracts" / "deployments" / "sepolia.json"
_DAY_SECONDS = 86400
_SEPOLIA_EXPLORER_TX = "https://sepolia.etherscan.io/tx/"


def _normalize_hash_hex(value: str) -> str:
    clean = value.strip().lower()
    if clean.startswith("0x"):
        clean = clean[2:]
    if len(clean) != 64:
        raise HTTPException(status_code=400, detail="Hash harus berupa 32-byte hex (64 karakter).")
    try:
        bytes.fromhex(clean)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Hash mengandung karakter non-hex.") from exc
    return clean


def normalize_bytes32(value: str) -> bytes:
    return bytes.fromhex(_normalize_hash_hex(value))


def derive_article_key(article_key: Optional[str], url: Optional[str], article_hash: str) -> str:
    if article_key:
        return "0x" + _normalize_hash_hex(article_key)
    if url and url.strip():
        return "0x" + Web3.keccak(text=url.strip()).hex().removeprefix("0x")
    return "0x" + _normalize_hash_hex(article_hash)


def _get_ticket_secret() -> bytes:
    raw = config.VERIFY_TICKET_SECRET or config.PRIVY_APP_SECRET or config.RELAYER_PRIVATE_KEY
    if not raw:
        raw = "veritaschain-ephemeral-dev-secret"
    return hashlib.sha256(f"veritas-ticket:{raw}".encode("utf-8")).digest()


class VerifyTicketStore:
    """Binds /api/verify output to /api/relay via HMAC-signed short-lived tickets."""

    def __init__(self) -> None:
        self._tickets: Dict[str, Dict[str, Any]] = {}
        self._by_payload: Dict[Tuple[str, str, int], str] = {}
        self._consumed_jtis: Dict[str, float] = {}

    def _prune(self, now: float) -> None:
        expired_jtis = [jti for jti, data in self._tickets.items() if data["exp"] <= now]
        for jti in expired_jtis:
            data = self._tickets.pop(jti, None)
            if data:
                key = (data["articleHash"], data["ipfsCid"], data["credibilityScore"])
                if self._by_payload.get(key) == jti:
                    self._by_payload.pop(key, None)
        for jti in [k for k, exp in self._consumed_jtis.items() if exp <= now]:
            self._consumed_jtis.pop(jti, None)

    def issue(
        self,
        *,
        article_hash: str,
        ipfs_cid: str,
        credibility_score: int,
        metadata: Dict[str, Any],
    ) -> str:
        now = time.time()
        self._prune(now)

        norm_hash = _normalize_hash_hex(article_hash)
        jti = secrets.token_hex(16)
        exp = int(now) + config.VERIFY_TICKET_TTL_SECONDS

        payload = {
            "jti": jti,
            "articleHash": norm_hash,
            "ipfsCid": ipfs_cid,
            "credibilityScore": int(credibility_score),
            "exp": exp,
        }
        raw_bytes = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
        b64_payload = base64.urlsafe_b64encode(raw_bytes).decode("ascii").rstrip("=")
        sig = hmac.new(_get_ticket_secret(), b64_payload.encode("ascii"), hashlib.sha256).hexdigest()
        token = f"{b64_payload}.{sig}"

        self._tickets[jti] = {**payload, "metadata": metadata, "used": False}
        self._by_payload[(norm_hash, ipfs_cid, int(credibility_score))] = jti
        return token

    def validate(
        self,
        *,
        article_hash: str,
        ipfs_cid: str,
        credibility_score: int,
        ticket_token: Optional[str],
    ) -> Dict[str, Any]:
        now = time.time()
        self._prune(now)
        norm_hash = _normalize_hash_hex(article_hash)
        score = int(credibility_score)

        if ticket_token:
            parts = ticket_token.strip().split(".", 1)
            if len(parts) != 2:
                raise HTTPException(status_code=403, detail="Format verifyTicket tidak valid.")
            b64_payload, sig = parts
            expected_sig = hmac.new(
                _get_ticket_secret(), b64_payload.encode("ascii"), hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(sig, expected_sig):
                raise HTTPException(status_code=403, detail="Signature verifyTicket tidak valid.")

            padded = b64_payload + "=" * (-len(b64_payload) % 4)
            try:
                payload = json.loads(base64.urlsafe_b64decode(padded).decode("utf-8"))
            except Exception as exc:
                raise HTTPException(status_code=403, detail="Payload verifyTicket rusak.") from exc

            if int(payload.get("exp", 0)) <= now:
                raise HTTPException(status_code=403, detail="verifyTicket sudah kedaluwarsa. Jalankan /api/verify ulang.")

            if (
                payload.get("articleHash") != norm_hash
                or payload.get("ipfsCid") != ipfs_cid
                or int(payload.get("credibilityScore", -1)) != score
            ):
                raise HTTPException(status_code=403, detail="Payload relay tidak cocok dengan hasil /api/verify.")

            jti = str(payload.get("jti", ""))
            if jti in self._consumed_jtis or self._tickets.get(jti, {}).get("used"):
                raise HTTPException(status_code=403, detail="verifyTicket sudah pernah dipakai.")

            meta = self._tickets.get(jti, {}).get("metadata", {})
            return {"jti": jti, "exp": int(payload["exp"]), "metadata": meta}

        # Support clients omitting verifyTicket field as long as /api/verify issued matching values recently.
        jti = self._by_payload.get((norm_hash, ipfs_cid, score))
        entry = self._tickets.get(jti) if jti else None
        if not entry or entry.get("used"):
            raise HTTPException(
                status_code=403,
                detail="Hasil verifikasi belum terdaftar atau tiket sudah kedaluwarsa. Jalankan /api/verify terlebih dahulu.",
            )
        return {"jti": jti, "exp": entry["exp"], "metadata": entry.get("metadata", {})}

    def mark_consumed(self, ticket_info: Dict[str, Any]) -> None:
        jti = ticket_info.get("jti")
        if not jti:
            return
        self._consumed_jtis[jti] = float(ticket_info.get("exp", time.time() + _DAY_SECONDS))
        if jti in self._tickets:
            self._tickets[jti]["used"] = True


class RelayGuard:
    """Enforces per-user rate limits, cooldowns, and global relayer circuit breakers."""

    def __init__(self) -> None:
        self._user_timestamps: Dict[str, Deque[float]] = defaultdict(deque)
        self._global_timestamps: Deque[float] = deque()

    def _prune_window(self, q: Deque[float], cutoff: float) -> None:
        while q and q[0] <= cutoff:
            q.popleft()

    def _query_supabase_counts(self, wallet_address: str) -> Tuple[int, int, Optional[float]]:
        if not config.SUPABASE_URL or not config.SUPABASE_SERVICE_ROLE_KEY:
            return 0, 0, None

        try:
            from supabase import create_client

            sb = create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
            since_iso = (datetime.now(timezone.utc) - timedelta(seconds=_DAY_SECONDS)).isoformat()

            global_res = (
                sb.table("verifications")
                .select("id", count="exact")
                .not_.is_("tx_hash", "null")
                .gte("created_at", since_iso)
                .execute()
            )
            global_count = int(global_res.count or 0)

            user_res = (
                sb.table("verifications")
                .select("created_at", count="exact")
                .eq("user_address", wallet_address.lower())
                .not_.is_("tx_hash", "null")
                .gte("created_at", since_iso)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            user_count = int(user_res.count or 0)
            last_ts: Optional[float] = None
            if user_res.data:
                raw_ts = user_res.data[0].get("created_at")
                if raw_ts:
                    last_ts = datetime.fromisoformat(str(raw_ts).replace("Z", "+00:00")).timestamp()
            return user_count, global_count, last_ts
        except Exception as exc:
            # Degrade to in-memory window if Supabase is unreachable so relayer doesn't crash on transient DB outage.
            print(f"[RelayGuard] Supabase quota query fallback to memory: {exc}")
            return 0, 0, None

    def check_limits(self, *, user_key: str, wallet_address: str, balance_wei: int, gas_price_wei: int) -> int:
        now = time.time()
        cutoff = now - _DAY_SECONDS

        self._prune_window(self._global_timestamps, cutoff)
        user_q = self._user_timestamps[user_key]
        self._prune_window(user_q, cutoff)

        db_user_count, db_global_count, db_last_ts = self._query_supabase_counts(wallet_address)
        global_used = max(len(self._global_timestamps), db_global_count)
        user_used = max(len(user_q), db_user_count)

        min_balance_wei = int(config.RELAY_MIN_BALANCE_ETH * 10**18)
        if balance_wei < min_balance_wei:
            raise HTTPException(
                status_code=503,
                detail={
                    "message": "Saldo relayer di bawah batas aman. Gunakan wallet pribadi (recordVerification).",
                    "fallbackMode": "direct_wallet",
                },
            )

        max_gas_wei = int(config.RELAY_MAX_GAS_PRICE_GWEI * 10**9)
        if gas_price_wei > max_gas_wei:
            raise HTTPException(
                status_code=503,
                detail={
                    "message": "Gas fee jaringan sedang melonjak di atas batas aman relayer.",
                    "fallbackMode": "direct_wallet",
                },
            )

        if global_used >= config.RELAY_GLOBAL_DAILY_LIMIT:
            raise HTTPException(
                status_code=429,
                detail={
                    "message": "Kuota harian global relayer gasless sudah tercapai. Catat langsung pakai ETH pribadi.",
                    "fallbackMode": "direct_wallet",
                },
            )

        last_mem_ts = user_q[-1] if user_q else None
        last_ts = max(t for t in (last_mem_ts, db_last_ts) if t is not None) if (last_mem_ts or db_last_ts) else None
        if last_ts is not None:
            elapsed = now - last_ts
            if elapsed < config.RELAY_USER_COOLDOWN_SECONDS:
                wait_sec = int(config.RELAY_USER_COOLDOWN_SECONDS - elapsed) + 1
                raise HTTPException(
                    status_code=429,
                    headers={"Retry-After": str(wait_sec)},
                    detail={
                        "message": f"Terlalu cepat. Tunggu {wait_sec} detik sebelum relay berikutnya.",
                        "fallbackMode": "direct_wallet",
                    },
                )

        if user_used >= config.RELAY_USER_DAILY_LIMIT:
            raise HTTPException(
                status_code=429,
                detail={
                    "message": f"Kuota gratis harian ({config.RELAY_USER_DAILY_LIMIT}x/hari) habis. Lanjutkan pakai wallet pribadi.",
                    "fallbackMode": "direct_wallet",
                },
            )

        return max(0, config.RELAY_USER_DAILY_LIMIT - user_used - 1)

    def record_success(self, user_key: str) -> None:
        now = time.time()
        self._user_timestamps[user_key].append(now)
        self._global_timestamps.append(now)

    def snapshot_global(self, balance_wei: Optional[int] = None, gas_price_wei: Optional[int] = None) -> Dict[str, Any]:
        now = time.time()
        self._prune_window(self._global_timestamps, now - _DAY_SECONDS)
        _, db_global, _ = self._query_supabase_counts("")
        global_used = max(len(self._global_timestamps), db_global)
        bal_eth = float(balance_wei / 10**18) if balance_wei is not None else None
        gas_gwei = float(gas_price_wei / 10**9) if gas_price_wei is not None else None
        circuit_open = (
            global_used >= config.RELAY_GLOBAL_DAILY_LIMIT
            or (bal_eth is not None and bal_eth < config.RELAY_MIN_BALANCE_ETH)
            or (gas_gwei is not None and gas_gwei > config.RELAY_MAX_GAS_PRICE_GWEI)
        )
        return {
            "globalUsedToday": global_used,
            "globalDailyLimit": config.RELAY_GLOBAL_DAILY_LIMIT,
            "userDailyLimit": config.RELAY_USER_DAILY_LIMIT,
            "userCooldownSeconds": config.RELAY_USER_COOLDOWN_SECONDS,
            "relayerBalanceEth": bal_eth,
            "minBalanceEth": config.RELAY_MIN_BALANCE_ETH,
            "gasPriceGwei": gas_gwei,
            "maxGasPriceGwei": config.RELAY_MAX_GAS_PRICE_GWEI,
            "circuitOpen": circuit_open,
        }


ticket_store = VerifyTicketStore()
relay_guard = RelayGuard()
_tx_lock = asyncio.Lock()
_cached_contract_bundle: Optional[Tuple[Web3, Any, Dict[str, Any]]] = None


def _load_deployment_artifact() -> Dict[str, Any]:
    if not _DEPLOYMENT_FILE.exists():
        raise HTTPException(status_code=503, detail="Artifact deployment Sepolia belum tersedia.")
    return json.loads(_DEPLOYMENT_FILE.read_text(encoding="utf-8"))


def get_contract_bundle() -> Tuple[Web3, Any, Dict[str, Any]]:
    global _cached_contract_bundle
    if _cached_contract_bundle is not None:
        return _cached_contract_bundle

    artifact = _load_deployment_artifact()
    contract_addr = config.CONTRACT_ADDRESS or artifact.get("address", "")
    if not Web3.is_address(contract_addr):
        raise HTTPException(status_code=503, detail="CONTRACT_ADDRESS tidak valid atau belum diset.")
    if not config.SEPOLIA_RPC_URL:
        raise HTTPException(status_code=503, detail="SEPOLIA_RPC_URL belum dikonfigurasi.")

    w3 = Web3(Web3.HTTPProvider(config.SEPOLIA_RPC_URL, request_kwargs={"timeout": 20}))
    contract = w3.eth.contract(address=Web3.to_checksum_address(contract_addr), abi=artifact["abi"])
    _cached_contract_bundle = (w3, contract, artifact)
    return _cached_contract_bundle


def _verify_eip712_signature(
    *,
    artifact: Dict[str, Any],
    contract_address: str,
    article_key_bytes: bytes,
    content_hash_bytes: bytes,
    ipfs_cid: str,
    credibility_score: int,
    verifier: str,
    nonce: int,
    deadline: int,
    signature: str,
) -> None:
    if deadline <= int(time.time()):
        raise HTTPException(status_code=400, detail="Signature EIP-712 sudah kedaluwarsa (deadline terlewati).")

    eip712_cfg = artifact.get("eip712", {})
    domain = dict(eip712_cfg.get("domain", {}))
    domain["verifyingContract"] = Web3.to_checksum_address(contract_address)
    domain["chainId"] = int(domain.get("chainId", 11155111))

    full_message = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            **eip712_cfg["types"],
        },
        "primaryType": "RecordVerification",
        "domain": domain,
        "message": {
            "articleKey": article_key_bytes,
            "contentHash": content_hash_bytes,
            "ipfsCid": ipfs_cid,
            "credibilityScore": int(credibility_score),
            "verifier": Web3.to_checksum_address(verifier),
            "nonce": int(nonce),
            "deadline": int(deadline),
        },
    }

    try:
        signable = encode_typed_data(full_message=full_message)
        recovered = Account.recover_message(signable, signature=signature)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Format signature EIP-712 tidak valid: {exc}") from exc

    if recovered.lower() != verifier.lower():
        raise HTTPException(status_code=400, detail="Signature EIP-712 tidak cocok dengan alamat verifier.")


def _persist_verification_to_supabase(
    *,
    wallet_address: str,
    article_hash: str,
    ipfs_cid: str,
    credibility_score: int,
    tx_hash: str,
    metadata: Dict[str, Any],
) -> None:
    if not config.SUPABASE_URL or not config.SUPABASE_SERVICE_ROLE_KEY:
        return
    try:
        from supabase import create_client

        sb = create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
        row = {
            "user_address": wallet_address.lower(),
            "article_url": metadata.get("url") or None,
            "article_title": metadata.get("title") or "Untitled Article",
            "article_hash": article_hash,
            "credibility_score": int(credibility_score),
            "status": metadata.get("status") or ("VALID" if credibility_score >= 70 else "QUESTIONABLE"),
            "summary": metadata.get("summary"),
            "key_findings": metadata.get("keyFindings", []),
            "claims_review": metadata.get("claimsReview", []),
            "ipfs_cid": ipfs_cid,
            "tx_hash": tx_hash,
            "network": "Ethereum Sepolia",
        }
        sb.table("verifications").insert(row).execute()
    except Exception as exc:
        print(f"[Relayer] Gagal simpan log ke Supabase (non-fatal): {exc}")


async def relay_verification(req: RelayRequest, user_did: str) -> RelayResponse:
    if not config.RELAYER_PRIVATE_KEY:
        raise HTTPException(status_code=503, detail="RELAYER_PRIVATE_KEY belum dikonfigurasi di server.")
    if not req.ipfsCid or not req.ipfsCid.strip():
        raise HTTPException(status_code=400, detail="ipfsCid wajib diisi.")

    article_hash_hex = _normalize_hash_hex(req.articleHash)
    article_key_hex = derive_article_key(req.articleKey, req.url, article_hash_hex)
    article_key_bytes = normalize_bytes32(article_key_hex)
    content_hash_bytes = normalize_bytes32(article_hash_hex)
    verifier_checksum = Web3.to_checksum_address(req.userAddress)

    # Gate 1 (Opsi 1): Verify server-issued /api/verify ticket so clients cannot forge score or CID.
    ticket_info = ticket_store.validate(
        article_hash=article_hash_hex,
        ipfs_cid=req.ipfsCid,
        credibility_score=req.credibilityScore,
        ticket_token=req.verifyTicket,
    )

    w3, contract, artifact = get_contract_bundle()
    relayer_account = Account.from_key(config.RELAYER_PRIVATE_KEY)

    # Gate 2 (Opsi 2): Deduplicate on-chain BEFORE checking quota or paying gas.
    def _preflight_chain_reads() -> Tuple[Tuple[bool, bool, int, bytes, int], int, int, int]:
        change_info = contract.functions.checkArticleChange(article_key_bytes, content_hash_bytes).call()
        nonce_val = contract.functions.nonces(verifier_checksum).call()
        bal_wei = w3.eth.get_balance(relayer_account.address)
        gas_wei = w3.eth.gas_price
        return change_info, int(nonce_val), int(bal_wei), int(gas_wei)

    change_info, verifier_nonce, balance_wei, gas_price_wei = await asyncio.to_thread(_preflight_chain_reads)
    exists, modified, latest_record_id, _, _ = change_info
    if exists and not modified:
        return RelayResponse(
            status="duplicate_skipped",
            txHash=None,
            explorerUrl=None,
            blockNumber=None,
            recordId=int(latest_record_id),
            articleKey=article_key_hex,
            remainingDailyQuota=None,
        )

    # Gate 3 (Opsi 2): Enforce user daily quota, cooldown, and global circuit breakers.
    user_key = f"{user_did}:{req.userAddress.lower()}"
    remaining_quota = await asyncio.to_thread(
        relay_guard.check_limits,
        user_key=user_key,
        wallet_address=req.userAddress,
        balance_wei=balance_wei,
        gas_price_wei=gas_price_wei,
    )

    # Gate 4: Verify EIP-712 signature off-chain before simulating/broadcasting on-chain.
    _verify_eip712_signature(
        artifact=artifact,
        contract_address=contract.address,
        article_key_bytes=article_key_bytes,
        content_hash_bytes=content_hash_bytes,
        ipfs_cid=req.ipfsCid,
        credibility_score=req.credibilityScore,
        verifier=verifier_checksum,
        nonce=verifier_nonce,
        deadline=req.deadline,
        signature=req.signature,
    )

    async with _tx_lock:
        def _submit_onchain() -> Tuple[str, int, Optional[int]]:
            fn_call = contract.functions.recordVerificationMeta(
                article_key_bytes,
                content_hash_bytes,
                req.ipfsCid,
                int(req.credibilityScore),
                verifier_checksum,
                int(req.deadline),
                req.signature,
            )
            try:
                estimated_gas = fn_call.estimate_gas({"from": relayer_account.address})
            except ContractLogicError as exc:
                raise HTTPException(status_code=400, detail=f"Transaksi ditolak smart contract: {exc}") from exc

            relayer_nonce = w3.eth.get_transaction_count(relayer_account.address, "pending")
            tx_params = fn_call.build_transaction(
                {
                    "from": relayer_account.address,
                    "nonce": relayer_nonce,
                    "gas": int(estimated_gas * 1.2),
                    "gasPrice": w3.eth.gas_price,
                    "chainId": int(artifact.get("eip712", {}).get("domain", {}).get("chainId", 11155111)),
                }
            )
            signed_tx = relayer_account.sign_transaction(tx_params)
            tx_hash_bytes = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=120)
            if receipt["status"] != 1:
                raise HTTPException(status_code=500, detail="Transaksi on-chain gagal dieksekusi.")

            rec_id: Optional[int] = None
            try:
                events = contract.events.VerificationRecorded().process_receipt(receipt)
                if events:
                    rec_id = int(events[0]["args"]["recordId"])
            except Exception:
                rec_id = None

            tx_hex = "0x" + tx_hash_bytes.hex().removeprefix("0x")
            return tx_hex, int(receipt["blockNumber"]), rec_id

        tx_hash, block_number, record_id = await asyncio.to_thread(_submit_onchain)

    ticket_store.mark_consumed(ticket_info)
    relay_guard.record_success(user_key)
    await asyncio.to_thread(
        _persist_verification_to_supabase,
        wallet_address=req.userAddress,
        article_hash=article_hash_hex,
        ipfs_cid=req.ipfsCid,
        credibility_score=req.credibilityScore,
        tx_hash=tx_hash,
        metadata={**ticket_info.get("metadata", {}), "url": req.url or ticket_info.get("metadata", {}).get("url")},
    )

    return RelayResponse(
        status="success",
        txHash=tx_hash,
        explorerUrl=f"{_SEPOLIA_EXPLORER_TX}{tx_hash}",
        blockNumber=block_number,
        recordId=record_id,
        articleKey=article_key_hex,
        remainingDailyQuota=remaining_quota,
    )


async def get_relayer_status() -> Dict[str, Any]:
    bal_wei: Optional[int] = None
    gas_wei: Optional[int] = None
    try:
        w3, _, _ = get_contract_bundle()
        if config.RELAYER_PRIVATE_KEY:
            relayer_addr = Account.from_key(config.RELAYER_PRIVATE_KEY).address
            bal_wei, gas_wei = await asyncio.to_thread(
                lambda: (w3.eth.get_balance(relayer_addr), w3.eth.gas_price)
            )
    except Exception:
        pass
    return await asyncio.to_thread(relay_guard.snapshot_global, bal_wei, gas_wei)
