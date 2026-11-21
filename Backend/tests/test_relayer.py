import hashlib
import json
import sys
import time
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from eth_account import Account
from eth_account.messages import encode_typed_data
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import config  # noqa: E402
import main as backend_main  # noqa: E402
from services import privy_auth, relayer  # noqa: E402


DEPLOYMENT_ARTIFACT = json.loads(
    (BACKEND_DIR.parent / "Contracts" / "deployments" / "sepolia.json").read_text(encoding="utf-8")
)


def _sign_eip712(
    signer_acct,
    *,
    article_key_hex: str,
    article_hash_hex: str,
    ipfs_cid: str,
    credibility_score: int,
    nonce: int,
    deadline: int,
) -> str:
    domain = dict(DEPLOYMENT_ARTIFACT["eip712"]["domain"])
    full_message = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            **DEPLOYMENT_ARTIFACT["eip712"]["types"],
        },
        "primaryType": "RecordVerification",
        "domain": domain,
        "message": {
            "articleKey": bytes.fromhex(article_key_hex.removeprefix("0x")),
            "contentHash": bytes.fromhex(article_hash_hex.removeprefix("0x")),
            "ipfsCid": ipfs_cid,
            "credibilityScore": credibility_score,
            "verifier": signer_acct.address,
            "nonce": nonce,
            "deadline": deadline,
        },
    }
    signable = encode_typed_data(full_message=full_message)
    return signer_acct.sign_message(signable).signature.hex()


class TestRelayerSecurityAndGuards(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(backend_main.app)
        self.user_acct = Account.create()
        self.relayer_acct = Account.create()
        self.article_url = "https://news.example.com/artikel-uji"
        self.article_hash = hashlib.sha256(b"isi berita uji veritaschain").hexdigest()
        self.article_key = "0x" + hashlib.sha256(self.article_url.encode()).hexdigest()
        self.ipfs_cid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
        self.score = 88

        # Reset stateful stores between tests
        relayer.ticket_store = relayer.VerifyTicketStore()
        backend_main.ticket_store = relayer.ticket_store
        relayer.relay_guard = relayer.RelayGuard()
        privy_auth._wallet_ownership_cache.clear()

        self._orig_relayer_key = config.RELAYER_PRIVATE_KEY
        self._orig_supabase_url = config.SUPABASE_URL
        self._orig_user_limit = config.RELAY_USER_DAILY_LIMIT
        self._orig_cooldown = config.RELAY_USER_COOLDOWN_SECONDS
        self._orig_global_limit = config.RELAY_GLOBAL_DAILY_LIMIT
        self._orig_min_bal = config.RELAY_MIN_BALANCE_ETH
        self._orig_max_gas = config.RELAY_MAX_GAS_PRICE_GWEI

        config.RELAYER_PRIVATE_KEY = self.relayer_acct.key.hex()
        config.SUPABASE_URL = ""  # Isolate unit tests from external DB writes

    def tearDown(self) -> None:
        config.RELAYER_PRIVATE_KEY = self._orig_relayer_key
        config.SUPABASE_URL = self._orig_supabase_url
        config.RELAY_USER_DAILY_LIMIT = self._orig_user_limit
        config.RELAY_USER_COOLDOWN_SECONDS = self._orig_cooldown
        config.RELAY_GLOBAL_DAILY_LIMIT = self._orig_global_limit
        config.RELAY_MIN_BALANCE_ETH = self._orig_min_bal
        config.RELAY_MAX_GAS_PRICE_GWEI = self._orig_max_gas

    def _issue_ticket(self) -> str:
        return relayer.ticket_store.issue(
            article_hash=self.article_hash,
            ipfs_cid=self.ipfs_cid,
            credibility_score=self.score,
            metadata={"url": self.article_url, "title": "Artikel Uji", "status": "VALID"},
        )

    def _make_payload(self, *, ticket: str | None = None, deadline: int | None = None, score: int | None = None) -> dict:
        dl = deadline if deadline is not None else int(time.time()) + 600
        sc = score if score is not None else self.score
        sig = _sign_eip712(
            self.user_acct,
            article_key_hex=self.article_key,
            article_hash_hex=self.article_hash,
            ipfs_cid=self.ipfs_cid,
            credibility_score=sc,
            nonce=0,
            deadline=dl,
        )
        return {
            "userAddress": self.user_acct.address,
            "articleHash": "0x" + self.article_hash,
            "articleKey": self.article_key,
            "url": self.article_url,
            "credibilityScore": sc,
            "ipfsCid": self.ipfs_cid,
            "deadline": dl,
            "signature": "0x" + sig.removeprefix("0x"),
            "verifyTicket": ticket,
        }

    def _mock_bundle(self, *, exists=False, modified=False, balance_wei=10**18, gas_wei=10**9):
        mock_w3 = MagicMock()
        mock_w3.eth.get_balance.return_value = balance_wei
        mock_w3.eth.gas_price = gas_wei
        mock_w3.eth.get_transaction_count.return_value = 7
        fake_tx_hash = bytes.fromhex("ab" * 32)
        mock_w3.eth.send_raw_transaction.return_value = fake_tx_hash
        mock_w3.eth.wait_for_transaction_receipt.return_value = {"status": 1, "blockNumber": 123456}

        mock_contract = MagicMock()
        mock_contract.address = DEPLOYMENT_ARTIFACT["address"]
        mock_contract.functions.checkArticleChange.return_value.call.return_value = (
            exists,
            modified,
            42 if exists else 0,
            b"\x00" * 32,
            1 if exists else 0,
        )
        mock_contract.functions.nonces.return_value.call.return_value = 0

        fn_call = mock_contract.functions.recordVerificationMeta.return_value
        fn_call.estimate_gas.return_value = 180000
        fn_call.build_transaction.return_value = {
            "to": DEPLOYMENT_ARTIFACT["address"],
            "value": 0,
            "gas": 216000,
            "gasPrice": gas_wei,
            "nonce": 7,
            "chainId": 11155111,
            "data": "0x1234",
        }
        mock_contract.events.VerificationRecorded.return_value.process_receipt.return_value = [
            {"args": {"recordId": 99}}
        ]
        return mock_w3, mock_contract, DEPLOYMENT_ARTIFACT

    def test_requires_privy_bearer_token(self) -> None:
        ticket = self._issue_ticket()
        res = self.client.post("/api/relay", json=self._make_payload(ticket=ticket))
        self.assertEqual(res.status_code, 401)

    def test_rejects_forged_verify_ticket(self) -> None:
        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with patch("main.verify_privy_user_wallet", side_effect=fake_auth):
            res = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket="tampered.signature"),
            )
        self.assertEqual(res.status_code, 403)

    def test_rejects_score_tampering_against_ticket(self) -> None:
        ticket = self._issue_ticket()

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with patch("main.verify_privy_user_wallet", side_effect=fake_auth):
            res = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket, score=99),
            )
        self.assertEqual(res.status_code, 403)

    def test_dedup_onchain_returns_skipped_without_spending_gas(self) -> None:
        ticket = self._issue_ticket()
        bundle = self._mock_bundle(exists=True, modified=False)

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with (
            patch("main.verify_privy_user_wallet", side_effect=fake_auth),
            patch("services.relayer.get_contract_bundle", return_value=bundle),
        ):
            res = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket),
            )

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["status"], "duplicate_skipped")
        self.assertEqual(body["recordId"], 42)
        bundle[0].eth.send_raw_transaction.assert_not_called()

    def test_circuit_breaker_low_balance_returns_503(self) -> None:
        ticket = self._issue_ticket()
        bundle = self._mock_bundle(balance_wei=int(0.01 * 10**18))

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with (
            patch("main.verify_privy_user_wallet", side_effect=fake_auth),
            patch("services.relayer.get_contract_bundle", return_value=bundle),
        ):
            res = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket),
            )

        self.assertEqual(res.status_code, 503)
        self.assertEqual(res.json()["detail"]["fallbackMode"], "direct_wallet")

    def test_circuit_breaker_gas_spike_returns_503(self) -> None:
        ticket = self._issue_ticket()
        bundle = self._mock_bundle(gas_wei=int(120 * 10**9))

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with (
            patch("main.verify_privy_user_wallet", side_effect=fake_auth),
            patch("services.relayer.get_contract_bundle", return_value=bundle),
        ):
            res = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket),
            )

        self.assertEqual(res.status_code, 503)

    def test_successful_relay_then_cooldown_enforced(self) -> None:
        ticket1 = self._issue_ticket()
        bundle = self._mock_bundle()

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with (
            patch("main.verify_privy_user_wallet", side_effect=fake_auth),
            patch("services.relayer.get_contract_bundle", return_value=bundle),
        ):
            res1 = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket1),
            )
            self.assertEqual(res1.status_code, 200)
            data1 = res1.json()
            self.assertEqual(data1["status"], "success")
            self.assertEqual(data1["recordId"], 99)
            self.assertTrue(data1["txHash"].startswith("0x"))
            self.assertEqual(data1["remainingDailyQuota"], config.RELAY_USER_DAILY_LIMIT - 1)

            # Immediate second request hits per-user cooldown (30s)
            ticket2 = self._issue_ticket()
            res2 = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=ticket2),
            )
            self.assertEqual(res2.status_code, 429)
            self.assertIn("Retry-After", res2.headers)

    def test_user_daily_limit_returns_429_with_fallback(self) -> None:
        config.RELAY_USER_COOLDOWN_SECONDS = 0
        config.RELAY_USER_DAILY_LIMIT = 2
        bundle = self._mock_bundle()

        async def fake_auth(_auth, _addr):
            return "did:privy:user1"

        with (
            patch("main.verify_privy_user_wallet", side_effect=fake_auth),
            patch("services.relayer.get_contract_bundle", return_value=bundle),
        ):
            for _ in range(2):
                t = self._issue_ticket()
                r = self.client.post(
                    "/api/relay",
                    headers={"Authorization": "Bearer fake-jwt"},
                    json=self._make_payload(ticket=t),
                )
                self.assertEqual(r.status_code, 200)

            t3 = self._issue_ticket()
            r3 = self.client.post(
                "/api/relay",
                headers={"Authorization": "Bearer fake-jwt"},
                json=self._make_payload(ticket=t3),
            )
            self.assertEqual(r3.status_code, 429)
            self.assertEqual(r3.json()["detail"]["fallbackMode"], "direct_wallet")


if __name__ == "__main__":
    unittest.main()
