import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main as backend_main  # noqa: E402
from services import ipfs_service  # noqa: E402


class TestIpfsPinning(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(backend_main.app)

    def test_verify_uses_exact_pinata_cid_in_response_ticket_and_history(self) -> None:
        url = "https://media.test/berita-pinata-sync"
        article_text = "Menteri Keuangan meresmikan peraturan baru hari ini secara terbuka."
        real_pinata_cid = "bafkreih535y6m7iqnhroqpmnmyt4lojm7bljzn4huc7cgs7pydb3r5jazy"
        saved_records = []

        def fake_save_history(row):
            saved_records.append(row)
            return True

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>ok</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=article_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Uji Pinata", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.search_fact_checks", return_value=[]),
            patch(
                "main.verify_article_with_gemini",
                return_value={
                    "isNews": True,
                    "credibilityScore": 90,
                    "status": "VALID",
                    "narasi": "Ringkasan klaim.",
                    "penjelasan": "Penjelasan valid.",
                    "kesimpulan": "Kesimpulan valid.",
                    "summary": "Valid",
                    "keyFindings": ["Fakta resmi"],
                },
            ),
            patch("main.pin_json_to_ipfs", return_value=real_pinata_cid),
            patch("main.save_audit_history", side_effect=fake_save_history),
        ):
            res = self.client.post("/api/verify", json={"query": url, "mode": "url"})

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["ipfsCid"], real_pinata_cid)
        self.assertEqual(len(saved_records), 1)
        self.assertEqual(saved_records[0]["ipfs_cid"], real_pinata_cid)
        validated = backend_main.ticket_store.validate(
            article_hash=body["articleHash"],
            ipfs_cid=real_pinata_cid,
            credibility_score=90,
            ticket_token=body["verifyTicket"],
        )
        self.assertTrue(bool(validated.get("jti")))

    def test_verify_falls_back_to_local_cidv1_when_pinata_returns_empty(self) -> None:
        url = "https://media.test/berita-pinata-fallback"
        article_text = "Pemerintah mengumumkan jadwal resmi rapat koordinasi nasional."

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>ok</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=article_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Fallback", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.search_fact_checks", return_value=[]),
            patch(
                "main.verify_article_with_gemini",
                return_value={
                    "isNews": True,
                    "credibilityScore": 85,
                    "status": "VALID",
                    "narasi": "Ringkasan.",
                    "penjelasan": "Penjelasan.",
                    "kesimpulan": "Kesimpulan.",
                    "summary": "Valid",
                    "keyFindings": ["Fakta"],
                },
            ),
            patch("main.pin_json_to_ipfs", return_value=""),
            patch("main.save_audit_history", return_value=True),
        ):
            res = self.client.post("/api/verify", json={"query": url, "mode": "url"})

        self.assertEqual(res.status_code, 200)
        cid = res.json()["ipfsCid"]
        self.assertTrue(cid.startswith("bafkrei"))
        self.assertNotIn("demo", cid)

    def test_pin_json_to_ipfs_returns_empty_without_jwt(self) -> None:
        import asyncio

        with patch.object(ipfs_service, "PINATA_JWT", ""):
            cid = asyncio.run(ipfs_service.pin_json_to_ipfs({"hello": "world"}))
        self.assertEqual(cid, "")

    def test_pin_json_to_ipfs_returns_empty_on_http_error(self) -> None:
        import asyncio

        mock_res = MagicMock(status_code=500, text="Pinata error")
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_res
        mock_cm = AsyncMock()
        mock_cm.__aenter__.return_value = mock_client

        with (
            patch.object(ipfs_service, "PINATA_JWT", "fake-jwt"),
            patch("services.ipfs_service.httpx.AsyncClient", return_value=mock_cm),
        ):
            cid = asyncio.run(ipfs_service.pin_json_to_ipfs({"hello": "world"}))
        self.assertEqual(cid, "")
