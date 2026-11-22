import json
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main as backend_main  # noqa: E402
from services import ai_verifier  # noqa: E402


class TestAIVerifierStrictValidation(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(backend_main.app)
        self._orig_key = ai_verifier.GEMINI_API_KEY
        backend_main._VERIFY_CACHE.clear()

    def tearDown(self) -> None:
        ai_verifier.GEMINI_API_KEY = self._orig_key
        backend_main._VERIFY_CACHE.clear()

    def _mock_gemini_response(self, payload_text: str):
        mock_client = MagicMock()
        mock_resp = MagicMock()
        mock_resp.text = payload_text
        mock_client.models.generate_content.return_value = mock_resp
        return mock_client

    def test_missing_api_key_returns_503_not_fake_75(self) -> None:
        ai_verifier.GEMINI_API_KEY = ""
        res = self.client.post(
            "/api/verify",
            json={"query": "Pemerintah mengumumkan kebijakan subsidi baru hari ini."},
        )
        self.assertEqual(res.status_code, 503)
        self.assertIn("GEMINI_API_KEY", res.json()["detail"])

    def test_gemini_down_returns_503_not_fake_70(self) -> None:
        ai_verifier.GEMINI_API_KEY = "test-key"
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = RuntimeError("503 Service Unavailable")

        with patch("services.ai_verifier.genai.Client", return_value=mock_client):
            res = self.client.post(
                "/api/verify",
                json={"query": "Pemerintah mengumumkan kebijakan subsidi baru hari ini."},
            )

        self.assertEqual(res.status_code, 503)
        self.assertIn("mati", res.json()["detail"].lower())

    def test_missing_credibility_score_returns_502_not_default_80(self) -> None:
        ai_verifier.GEMINI_API_KEY = "test-key"
        incomplete_payload = json.dumps({
            "isNews": True,
            "notNewsReason": None,
            "narasi": "Beredar klaim kebijakan baru.",
            "penjelasan": "Penjelasan fakta valid.",
            "kesimpulan": "Klaim ini valid.",
            "status": "VALID",
            "summary": "Ringkasan hasil.",
            "keyFindings": ["Poin 1", "Poin 2", "Poin 3"],
        })
        mock_client = self._mock_gemini_response(incomplete_payload)

        with patch("services.ai_verifier.genai.Client", return_value=mock_client):
            res = self.client.post(
                "/api/verify",
                json={"query": "Pemerintah mengumumkan kebijakan subsidi baru hari ini."},
            )

        self.assertEqual(res.status_code, 502)
        self.assertIn("credibilityScore", res.json()["detail"])
        self.assertIn("kosong", res.json()["detail"].lower())

    def test_empty_text_fields_rejected_as_invalid(self) -> None:
        ai_verifier.GEMINI_API_KEY = "test-key"
        empty_fields_payload = json.dumps({
            "isNews": True,
            "notNewsReason": None,
            "narasi": "",
            "penjelasan": "   ",
            "kesimpulan": "Kesimpulan ada.",
            "credibilityScore": 90,
            "status": "VALID",
            "summary": "Ringkasan ada.",
            "keyFindings": [],
        })
        mock_client = self._mock_gemini_response(empty_fields_payload)

        with patch("services.ai_verifier.genai.Client", return_value=mock_client):
            res = self.client.post(
                "/api/verify",
                json={"query": "Pemerintah mengumumkan kebijakan subsidi baru hari ini."},
            )

        self.assertEqual(res.status_code, 502)
        detail = res.json()["detail"]
        self.assertIn("narasi", detail)
        self.assertIn("penjelasan", detail)
        self.assertIn("keyFindings", detail)

    def test_valid_gemini_response_succeeds(self) -> None:
        ai_verifier.GEMINI_API_KEY = "test-key"
        valid_payload = json.dumps({
            "isNews": True,
            "notNewsReason": None,
            "narasi": "Beredar informasi bahwa pemerintah merilis aturan baru.",
            "penjelasan": "Rilis resmi mengonfirmasi kebijakan berlaku mulai bulan depan.",
            "kesimpulan": "Informasi ini adalah fakta valid.",
            "credibilityScore": 92,
            "status": "VALID",
            "summary": "Informasi valid sesuai rilis resmi.",
            "keyFindings": ["Sumber resmi", "Data konsisten", "Tidak ada manipulasi"],
        })
        mock_client = self._mock_gemini_response(valid_payload)

        with (
            patch("services.ai_verifier.genai.Client", return_value=mock_client),
            patch("main.save_audit_history"),
            patch("main.pin_json_to_ipfs"),
        ):
            res = self.client.post(
                "/api/verify",
                json={"query": "Pemerintah mengumumkan kebijakan subsidi baru hari ini."},
            )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["credibilityScore"], 92)
        self.assertEqual(res.json()["status"], "VALID")


if __name__ == "__main__":
    unittest.main()
