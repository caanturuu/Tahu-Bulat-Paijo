import asyncio
import time
from typing import Dict, Tuple

import httpx
import jwt
from fastapi import HTTPException
from web3 import Web3

import config

_WALLET_CACHE_TTL_SECONDS = 300
_wallet_ownership_cache: Dict[Tuple[str, str], float] = {}
_jwk_clients: Dict[str, jwt.PyJWKClient] = {}


def _get_jwk_client(jwks_url: str) -> jwt.PyJWKClient:
    client = _jwk_clients.get(jwks_url)
    if client is None:
        client = jwt.PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)
        _jwk_clients[jwks_url] = client
    return client


def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Header Authorization Bearer wajib diisi.")
    parts = authorization.strip().split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise HTTPException(status_code=401, detail="Format Authorization harus 'Bearer <privy_access_token>'.")
    return parts[1].strip()


def _decode_privy_jwt(token: str) -> str:
    if not config.PRIVY_APP_ID or not config.PRIVY_JWKS_URL:
        raise HTTPException(status_code=503, detail="Konfigurasi Privy App ID belum lengkap di server.")

    try:
        jwk_client = _get_jwk_client(config.PRIVY_JWKS_URL)
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience=config.PRIVY_APP_ID,
            issuer="privy.io",
        )
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(status_code=401, detail="Token Privy sudah kedaluwarsa. Silakan login ulang.") from exc
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail=f"Token Privy tidak valid: {exc}") from exc

    user_did = claims.get("sub")
    if not user_did:
        raise HTTPException(status_code=401, detail="Token Privy tidak memuat identitas user (sub).")
    return str(user_did)


async def _verify_wallet_belongs_to_user(user_did: str, wallet_address: str) -> None:
    if not config.PRIVY_APP_ID or not config.PRIVY_APP_SECRET:
        raise HTTPException(status_code=503, detail="PRIVY_APP_SECRET belum dikonfigurasi di server.")

    normalized_wallet = wallet_address.lower()
    cache_key = (user_did, normalized_wallet)
    cached_until = _wallet_ownership_cache.get(cache_key)
    now = time.time()
    if cached_until and cached_until > now:
        return

    url = f"https://auth.privy.io/api/v1/users/{user_did}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                url,
                auth=(config.PRIVY_APP_ID, config.PRIVY_APP_SECRET),
                headers={"privy-app-id": config.PRIVY_APP_ID},
            )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail=f"Gagal menghubungi Privy Auth API: {exc}") from exc

    if res.status_code == 404:
        raise HTTPException(status_code=401, detail="Akun Privy tidak ditemukan.")
    if res.status_code >= 400:
        raise HTTPException(status_code=503, detail=f"Privy API menolak validasi user ({res.status_code}).")

    user_data = res.json()
    linked_accounts = user_data.get("linked_accounts") or []
    owned_wallets = {
        str(acc.get("address", "")).lower()
        for acc in linked_accounts
        if acc.get("type") == "wallet" and acc.get("address")
    }

    if normalized_wallet not in owned_wallets:
        raise HTTPException(
            status_code=403,
            detail="Alamat wallet verifier tidak terdaftar pada akun Privy yang login.",
        )

    _wallet_ownership_cache[cache_key] = now + _WALLET_CACHE_TTL_SECONDS


async def verify_privy_user_wallet(authorization: str | None, wallet_address: str) -> str:
    """Validate Privy Bearer JWT and verify the claimed EVM wallet belongs to that Privy user."""
    if not Web3.is_address(wallet_address):
        raise HTTPException(status_code=400, detail="Format userAddress EVM tidak valid.")

    token = _extract_bearer_token(authorization)
    # PyJWKClient performs synchronous HTTP if JWKS cache needs refresh.
    user_did = await asyncio.to_thread(_decode_privy_jwt, token)
    await _verify_wallet_belongs_to_user(user_did, wallet_address)
    return user_did
