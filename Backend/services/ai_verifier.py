import json
from typing import Dict, Any, List
from fastapi import HTTPException
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

_VALID_NEWS_STATUSES = {"VALID", "QUESTIONABLE", "HOAX"}


class _AIValidationError(ValueError):
    """Raised when Gemini responds with empty or invalid JSON fields."""


def _require_non_empty_str(data: Dict[str, Any], field: str, empty_fields: List[str]) -> str:
    val = data.get(field)
    if not isinstance(val, str) or not val.strip():
        empty_fields.append(field)
        return ""
    return val.strip()


def _validate_gemini_payload(result: Any) -> Dict[str, Any]:
    if not isinstance(result, dict):
        raise _AIValidationError("Respons AI kosong atau bukan objek JSON yang valid.")

    is_news = result.get("isNews")
    if not isinstance(is_news, bool):
        raise _AIValidationError("Field 'isNews' kosong atau tidak valid.")

    empty_fields: List[str] = []

    if not is_news:
        not_news_reason = _require_non_empty_str(result, "notNewsReason", empty_fields)
        narasi = _require_non_empty_str(result, "narasi", empty_fields)
        penjelasan = _require_non_empty_str(result, "penjelasan", empty_fields)
        kesimpulan = _require_non_empty_str(result, "kesimpulan", empty_fields)
        summary = _require_non_empty_str(result, "summary", empty_fields)

        raw_findings = result.get("keyFindings")
        key_findings = (
            [item.strip() for item in raw_findings if isinstance(item, str) and item.strip()]
            if isinstance(raw_findings, list)
            else []
        )
        if not key_findings:
            empty_fields.append("keyFindings")

        if empty_fields:
            raise _AIValidationError(
                f"Field hasil AI kosong dan tidak valid: {', '.join(empty_fields)}."
            )

        return {
            "isNews": False,
            "notNewsReason": not_news_reason,
            "narasi": narasi,
            "penjelasan": penjelasan,
            "kesimpulan": kesimpulan,
            "credibilityScore": 0,
            "status": "NOT_NEWS",
            "summary": summary,
            "keyFindings": key_findings,
        }

    raw_score = result.get("credibilityScore")
    score: int
    if raw_score is None or raw_score == "" or isinstance(raw_score, bool):
        empty_fields.append("credibilityScore")
        score = -1
    else:
        try:
            if isinstance(raw_score, float) and not raw_score.is_integer():
                raise ValueError("not integer")
            score = int(raw_score)
        except (TypeError, ValueError) as exc:
            raise _AIValidationError(
                "Field 'credibilityScore' tidak valid (harus angka bulat 0-100)."
            ) from exc
        if score < 0 or score > 100:
            raise _AIValidationError(
                f"Field 'credibilityScore' ({score}) di luar rentang 0-100 dan tidak valid."
            )

    raw_status = result.get("status")
    status = raw_status.strip().upper() if isinstance(raw_status, str) else ""
    if not status:
        empty_fields.append("status")
    elif status not in _VALID_NEWS_STATUSES:
        raise _AIValidationError(
            f"Field 'status' ({raw_status}) tidak valid."
        )

    narasi = _require_non_empty_str(result, "narasi", empty_fields)
    penjelasan = _require_non_empty_str(result, "penjelasan", empty_fields)
    kesimpulan = _require_non_empty_str(result, "kesimpulan", empty_fields)
    summary = _require_non_empty_str(result, "summary", empty_fields)

    raw_findings = result.get("keyFindings")
    key_findings = (
        [item.strip() for item in raw_findings if isinstance(item, str) and item.strip()]
        if isinstance(raw_findings, list)
        else []
    )
    if not key_findings:
        empty_fields.append("keyFindings")

    if empty_fields:
        raise _AIValidationError(
            f"Field hasil AI kosong dan tidak valid: {', '.join(empty_fields)}."
        )

    return {
        "isNews": True,
        "notNewsReason": None,
        "narasi": narasi,
        "penjelasan": penjelasan,
        "kesimpulan": kesimpulan,
        "credibilityScore": score,
        "status": status,
        "summary": summary,
        "keyFindings": key_findings,
    }


def verify_article_with_gemini(
    title: str,
    article_text: str,
    fact_check_claims: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Perform semantic reasoning and credibility scoring using Gemini Flash.
    Fails explicitly with HTTP 503/502 if Gemini is unavailable or returns empty/invalid fields.
    """
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        raise HTTPException(
            status_code=503,
            detail="Layanan AI Gemini sedang mati/nonaktif: GEMINI_API_KEY belum dikonfigurasi di server.",
        )

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""
Anda adalah mesin verifikasi berita dan pemeriksa fakta resmi tingkat tinggi bernama VeritasChain.
Tugas Anda:
1. VALIDASI KONTEN (Apakah Ini Berita atau Bukan?):
- Klasifikasikan apakah input ini merupakan BERITA / KLAIM INFORMASI PUBLIK (isNews = true) atau BUKAN BERITA (isNews = false).
- Kategori BERITA / KLAIM PUBLIK (isNews = true): artikel jurnalistik, berita portal, kabar/isu viral di media sosial, rilis pers instansi/pemerintah, klaim peristiwa (5W+1H), klaim bantuan sosial, rumor publik, atau narasi hoaks yang beredar di masyarakat.
- Kategori BUKAN BERITA (isNews = false): sapaan santai ("halo", "hai", "apa kabar"), resep masakan/makanan, baris kode program, matematika dasar, pertanyaan definisi umum kamus, curhatan/percakapan pribadi tanpa klaim publik, atau teks acak/gibberish.

2. INSTRUKSI OUTPUT JSON:
Jika isNews = false:
Kembalikan JSON persis berikut:
{{
  "isNews": false,
  "notNewsReason": "Jelaskan dengan ramah dalam 1-2 kalimat mengapa teks ini bukan merupakan artikel atau klaim berita publik.",
  "narasi": "Teks yang dimasukkan tidak teridentifikasi sebagai berita atau klaim informasi publik.",
  "penjelasan": "Konten ini tergolong teks non-berita. VeritasChain berfokus memeriksa keabsahan berita pers, isu viral, dan klaim kebijakan publik.",
  "kesimpulan": "Input Terdeteksi Bukan Berita.",
  "credibilityScore": 0,
  "status": "NOT_NEWS",
  "summary": "Teks ini bukan merupakan berita atau klaim peristiwa publik.",
  "keyFindings": [
    "Input tidak memuat unsur 5W+1H peristiwa atau kebijakan publik.",
    "Tidak ditemukan klaim faktual yang dapat diverifikasi kebenarannya.",
    "Sistem membatasi audit hanya untuk konten berita dan informasi publik."
  ]
}}

Jika isNews = true:
Lakukan analisis mendalam (standar MAFINDO / TurnBackHoax) dan kembalikan JSON:
{{
  "isNews": true,
  "notNewsReason": null,
  "narasi": (string: rangkuman narasi atau klaim viral yang beredar di masyarakat dalam 1-2 kalimat, diawali seperti "Beredar informasi/klaim bahwa..."),
  "penjelasan": (string: penjelasan terperinci mengenai duduk perkara dan fakta yang sebenarnya dalam 2-3 kalimat padat membantah disinformasi atau mengonfirmasi fakta),
  "kesimpulan": (string: 1 kalimat kesimpulan akhir yang singkat, padat, dan tegas mengenai kebenaran informasi ini beserta kategori hoaks/faktanya),
  "credibilityScore": (integer antara 0 sampai 100, di mana 0 = mutlak hoaks/palsu, 100 = fakta valid dan terverifikasi resmi),
  "status": (string: "VALID" jika skor >= 70, "QUESTIONABLE" jika skor 40-69, "HOAX" jika skor < 40),
  "summary": (string: ringkasan inti 1-2 kalimat mengenai hasil analisis),
  "keyFindings": (array of string: persis 3 poin temuan utama yang ringkas, padat, berbasis fakta dan data)
}}

[JUDUL ARTIKEL / KLAIM]
{title}

[TEKS ARTIKEL LENGKAP]
{article_text[:3500]}

[REFERENSI BASIS DATA CEK FAKTA RESMI (CLAIMREVIEW)]
{json.dumps(fact_check_claims, ensure_ascii=False) if fact_check_claims else "Tidak ada catatan sanggahan spesifik yang ditemukan di basis data."}
"""

    models_to_try = [
        {"model": "gemini-3.5-flash", "budget": 0},
        {"model": "gemini-3.5-flash-lite", "budget": None},
    ]
    validation_errors: List[str] = []
    service_errors: List[str] = []

    for item in models_to_try:
        model_name = item["model"]
        budget = item["budget"]
        try:
            cfg = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
                max_output_tokens=1024,
            )
            if budget is not None:
                cfg.thinking_config = types.ThinkingConfig(thinking_budget=budget)

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=cfg,
            )

            raw_text = getattr(response, "text", None)
            if not isinstance(raw_text, str) or not raw_text.strip():
                raise _AIValidationError("Respons AI kosong dan tidak valid.")

            try:
                result = json.loads(raw_text)
            except json.JSONDecodeError as exc:
                raise _AIValidationError("Respons AI bukan JSON yang valid.") from exc

            return _validate_gemini_payload(result)
        except _AIValidationError as exc:
            print(f"[GeminiVerifier] Invalid output from {model_name}: {exc}")
            validation_errors.append(f"{model_name}: {exc}")
        except Exception as exc:
            print(f"[GeminiVerifier] Error trying model {model_name}: {exc}")
            service_errors.append(f"{model_name}: {exc}")

    if validation_errors and not service_errors:
        raise HTTPException(
            status_code=502,
            detail=f"Respons AI tidak valid atau ada field kosong ({'; '.join(validation_errors)}). Verifikasi dibatalkan.",
        )

    if validation_errors:
        raise HTTPException(
            status_code=502,
            detail=f"Verifikasi AI gagal: sebagian output kosong/tidak valid dan model cadangan tidak merespons ({'; '.join(validation_errors + service_errors)}).",
        )

    raise HTTPException(
        status_code=503,
        detail=f"Layanan AI Gemini sedang mati atau tidak dapat dihubungi ({'; '.join(service_errors)}). Verifikasi dibatalkan agar tidak menghasilkan skor palsu.",
    )
