import hashlib
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main as backend_main  # noqa: E402


class TestRescanEndpoint(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(backend_main.app)

    def test_rescan_computes_real_word_diff_when_article_changed(self) -> None:
        original_text = "Status izin proyek resmi: XXX."
        live_text = "Status izin proyek resmi: YYY ZZZ."
        original_hash = hashlib.sha256(original_text.encode("utf-8")).hexdigest()

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>mock</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=live_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Uji", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.check_onchain_article_change", return_value={"exists": False, "modified": False}),
        ):
            res = self.client.post(
                "/api/rescan",
                json={
                    "url": "https://media.test/berita-1",
                    "originalHash": original_hash,
                    "originalText": original_text,
                },
            )

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertTrue(body["hasRevisions"])
        self.assertEqual(body["diffSummary"]["removedWords"], 1)
        self.assertEqual(body["diffSummary"]["addedWords"], 2)
        self.assertIn("XXX", body["diffSummary"]["diffHtml"])
        self.assertIn("YYY ZZZ", body["diffSummary"]["diffHtml"])

    def test_rescan_uses_verified_baseline_when_original_text_omitted(self) -> None:
        url = "https://media.test/berita-cycle-2"
        original_text = "Status izin proyek resmi: XXX."
        live_text = "Status izin proyek resmi: YYY ZZZ."

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>v1</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=original_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Cycle 2", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.search_fact_checks", return_value=[]),
            patch(
                "main.verify_article_with_gemini",
                return_value={
                    "isNews": True,
                    "credibilityScore": 82,
                    "status": "VALID",
                    "narasi": "Ringkasan klaim.",
                    "penjelasan": "Penjelasan uji.",
                    "kesimpulan": "Kesimpulan uji.",
                    "summary": "Valid",
                    "keyFindings": ["Fakta A"],
                },
            ),
            patch("main.save_audit_history", return_value=True),
            patch("main.pin_json_to_ipfs", return_value="bafybeigdummy"),
        ):
            verify_res = self.client.post("/api/verify", json={"query": url, "mode": "url"})

        self.assertEqual(verify_res.status_code, 200)
        original_hash = verify_res.json()["articleHash"]

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>v2</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=live_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Cycle 2", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.check_onchain_article_change", return_value={"exists": False, "modified": False}),
        ):
            rescan_res = self.client.post(
                "/api/rescan",
                json={"url": url, "originalHash": original_hash},
            )

        self.assertEqual(rescan_res.status_code, 200)
        body = rescan_res.json()
        self.assertTrue(body["hasRevisions"])
        self.assertEqual(body["diffSummary"]["removedWords"], 1)
        self.assertEqual(body["diffSummary"]["addedWords"], 2)
        self.assertIn("XXX", body["diffSummary"]["diffHtml"])
        self.assertIn("YYY ZZZ", body["diffSummary"]["diffHtml"])

    def test_rescan_reports_no_revisions_when_unchanged_even_with_0x_hash_prefix(self) -> None:
        article_text = "Pemerintah merilis data inflasi bulanan resmi."
        prefixed_hash = "0x" + hashlib.sha256(article_text.encode("utf-8")).hexdigest()

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>same</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=article_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Sama", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.check_onchain_article_change", return_value={"exists": False, "modified": False}),
        ):
            res = self.client.post(
                "/api/rescan",
                json={"url": "https://media.test/berita-sama", "originalHash": prefixed_hash},
            )

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertFalse(body["hasRevisions"])
        self.assertEqual(body["diffSummary"]["addedWords"], 0)
        self.assertEqual(body["diffSummary"]["removedWords"], 0)
        self.assertIsNone(body["diffSummary"]["diffHtml"])

    def test_rescan_does_not_fabricate_word_counts_when_baseline_text_unknown(self) -> None:
        live_text = "Artikel live terbaru dengan isi berbeda."
        unknown_hash = hashlib.sha256(b"teks lama yang tidak ada di memori").hexdigest()

        with (
            patch("services.scraper.trafilatura.fetch_url", return_value="<html><body>v2</body></html>"),
            patch("services.scraper.trafilatura.extract", return_value=live_text),
            patch(
                "services.scraper.trafilatura.extract_metadata",
                return_value=SimpleNamespace(title="Judul Baru", sitename="media.test", date="2026-11-22"),
            ),
            patch("main.check_onchain_article_change", return_value={"exists": False, "modified": False}),
        ):
            res = self.client.post(
                "/api/rescan",
                json={"url": "https://media.test/tanpa-baseline", "originalHash": unknown_hash},
            )

        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertTrue(body["hasRevisions"])
        self.assertEqual(body["diffSummary"]["addedWords"], 0)
        self.assertEqual(body["diffSummary"]["removedWords"], 0)
        self.assertIsNotNone(body["diffSummary"]["diffHtml"])
