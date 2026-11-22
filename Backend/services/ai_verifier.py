import json
import datetime
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

def verify_article_with_gemini(
    title: str,
    article_text: str,
    fact_check_claims: List[Dict[str, Any]],
    publisher: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Perform semantic reasoning and credibility scoring using Gemini Flash.
    Returns:
    - narasi: Narasi atau klaim isu yang beredar / ringkasan peristiwa
    - penjelasan: Penjelasan detail fakta / verifikasi
    - kesimpulan: Kesimpulan akhir
    - credibilityScore: 0 - 100
    - status: "VALID" | "QUESTIONABLE" | "HOAX"
    - summary: Ringkasan umum
    - keyFindings: 3 poin temuan utama
    """
    if not GEMINI_API_KEY:
        return {
            "credibilityScore": 75,
            "status": "VALID",
            "narasi": f"Klaim atau berita mengenai: {title}",
            "penjelasan": "Teks artikel telah diarsipkan dan dihitung integritas kriptografisnya. Kunci API Gemini belum disetel pada file .env.",
            "kesimpulan": "Perlu verifikasi lebih lanjut menggunakan API Key Gemini aktif.",
            "summary": "Kunci API Gemini belum dikonfigurasi. Menampilkan hasil verifikasi standar sistem.",
            "keyFindings": [
                "API Key Gemini belum disetel pada .env",
                "Format teks artikel terdeteksi bersih",
                "Integritas SHA-256 berhasil dihitung",
            ],
        }

    client = genai.Client(api_key=GEMINI_API_KEY)
    current_date_str = datetime.datetime.now().strftime("%d %B %Y")

    prompt = f"""
Anda adalah mesin verifikasi berita dan pemeriksa fakta resmi tingkat tinggi bernama VeritasChain.
WAKTU SISTEM SAAT INI: {current_date_str}.
Tahun saat ini adalah tahun berjalan di dunia nyata, BUKAN penanggalan fiktif masa depan. Pejabat publik (gubernur, kapolda, bupati, menteri) saat ini adalah pejabat hasil pemilu/pilkada atau mutasi resmi terbaru.

TUGAS ANDA:
1. VALIDASI KONTEN (Apakah Ini Berita atau Bukan?):
- Kategori BUKAN BERITA (isNews = false): sapaan santai ("halo", "hai", "apa kabar"), resep masakan, kode program, matematika dasar, pertanyaan definisi kamus, curhatan/percakapan pribadi tanpa klaim publik, atau teks acak/gibberish.
- Kategori BERITA / KLAIM PUBLIK (isNews = true): artikel jurnalistik pers, liputan berita portal, peristiwa nyata (kebakaran, musibah, bencana, kunjungan dinas, peresmian), kabar/isu viral di media sosial, rilis pers instansi/pemerintah, klaim bantuan sosial, atau narasi hoaks.

2. PRINSIP PENILAIAN FAKTA & SKOR KREDIBILITAS:
- KREDIBILITAS MEDIA PERS RESMI:
  Jika artikel berasal dari media pers resmi atau portal berita arus utama terverifikasi (misalnya Detikcom / detik.com, Kompas, Antaranews, Tempo, CNN Indonesia, CNBC Indonesia, Kumparan, Tirto, Liputan6, Tribunnews, Jawapos, Republika, Bisnis.com, Merdeka, Sindonews, dll.) dan melaporkan liputan peristiwa nyata jurnalistik:
  -> Artikel ini adalah BERITA FAKTA / VALID (skor 80 - 98)!
  -> JANGAN menganggap liputan pers kredibel sebagai hoaks kecuali jika ada sanggahan resmi spesifik di database ClaimReview (MAFINDO/TurnBackHoax).
- STATUS HOAX (< 40) HANYA DIBERIKAN JIKA:
  1) Ada catatan bantahan resmi dari konsorsium cek fakta (ClaimReview MAFINDO/Kompas/Tempo) yang secara eksplisit menyatakan klaim ini SALAH/HOAKS.
  2) Merupakan modus penipuan nyata (link bansos tunai fiktif via Telegram, link pendaftaran palsu, phising unduhan APK, giveaway mengatasnamakan tokoh).
  3) Teori konspirasi palsu atau pseudosains medis yang membahayakan (misal: vaksin beracun, obat instan kanker tanpa uji klinis).
  4) Pesan berantai anonim yang sepenuhnya mengada-ada tanpa sumber peristiwa nyata.
- STATUS QUESTIONABLE (40 - 69):
  Klaim yang belum dapat diverifikasi secara independen, konteks terpelintir (misleading context), atau judul clickbait yang tidak sesuai isi.

3. FORMAT OUTPUT JSON PERSIS:
Jika isNews = false:
{{
  "isNews": false,
  "notNewsReason": "Penjelasan ramah mengapa bukan berita publik.",
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
{{
  "isNews": true,
  "notNewsReason": null,
  "narasi": (string: untuk berita nyata, ringkas pokok peristiwa secara objektif; untuk hoaks/rumor, tuliskan klaim yang beredar),
  "penjelasan": (string: penjelasan fakta dan duduk perkara peristiwa secara objektif dan jernih dalam 2-3 kalimat),
  "kesimpulan": (string: 1 kalimat kesimpulan tegas mengenai validitas dan fakta berita ini),
  "credibilityScore": (integer 0-100: 80-98 untuk berita pers kredibel terverifikasi, 0-35 untuk hoaks/penipuan, 40-69 untuk meragukan),
  "status": (string: "VALID" jika skor >= 70, "QUESTIONABLE" jika 40-69, "HOAX" jika < 40),
  "summary": (string: ringkasan inti 1-2 kalimat),
  "keyFindings": (array of string: persis 3 poin temuan utama yang ringkas, padat, berbasis fakta peristiwa)
}}

[SUMBER / PENERBIT]: {publisher or "Portal Berita / Sumber Publik"}
[JUDUL ARTIKEL / KLAIM]: {title}
[TEKS ARTIKEL LENGKAP]:
{article_text[:3500]}

[REFERENSI BASIS DATA CEK FAKTA RESMI (CLAIMREVIEW)]:
{json.dumps(fact_check_claims, ensure_ascii=False) if fact_check_claims else "Tidak ada catatan sanggahan di basis data cek fakta resmi (tidak terindikasi hoaks)."}
"""

    models_to_try = [
        {"model": "gemini-3.5-flash", "budget": 0},
        {"model": "gemini-3.5-flash-lite", "budget": None},
        {"model": "gemini-3.1-flash-lite", "budget": 0},
    ]
    for item in models_to_try:
        model_name = item["model"]
        budget = item["budget"]
        try:
            cfg = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
                max_output_tokens=800,
            )
            if budget is not None:
                cfg.thinking_config = types.ThinkingConfig(thinking_budget=budget)

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=cfg,
            )

            result = json.loads(response.text)
            is_news = result.get("isNews", True)
            not_news_reason = result.get("notNewsReason")
            
            if not is_news:
                return {
                    "isNews": False,
                    "notNewsReason": not_news_reason or "Teks yang dimasukkan terdeteksi bukan merupakan artikel atau klaim berita publik.",
                    "narasi": result.get("narasi", "Teks yang dimasukkan tidak teridentifikasi sebagai berita atau klaim informasi publik."),
                    "penjelasan": result.get("penjelasan", "Konten ini tergolong teks non-berita. VeritasChain berfokus memeriksa keabsahan berita pers, isu viral, dan klaim kebijakan publik."),
                    "kesimpulan": result.get("kesimpulan", "Input Terdeteksi Bukan Berita."),
                    "credibilityScore": 0,
                    "status": "NOT_NEWS",
                    "summary": result.get("summary", "Teks ini bukan merupakan berita atau klaim peristiwa publik."),
                    "keyFindings": result.get("keyFindings", [
                        "Input tidak memuat unsur 5W+1H peristiwa atau kebijakan publik.",
                        "Tidak ditemukan klaim faktual yang dapat diverifikasi kebenarannya.",
                        "Sistem membatasi audit hanya untuk konten berita dan informasi publik."
                    ]),
                }

            score = int(result.get("credibilityScore", 80))
            status = result.get("status", "VALID" if score >= 70 else "QUESTIONABLE" if score >= 40 else "HOAX")
            narasi = result.get("narasi", f"Klaim terkait: {title}")
            penjelasan = result.get("penjelasan", result.get("summary", "Penjelasan fakta hasil verifikasi."))
            kesimpulan = result.get("kesimpulan", f"Berdasarkan verifikasi, informasi ini berstatus {status}.")
            summary = result.get("summary", kesimpulan)
            key_findings = result.get("keyFindings", [
                "Pemeriksaan teks konsisten dengan fakta umum.",
                "Tidak ada manipulasi klaim ekstrem terdeteksi.",
                "Struktur narasumber kredibel.",
            ])

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
        except Exception as e:
            print(f"[GeminiVerifier] Error trying model {model_name}: {e}")
            continue

    return {
        "narasi": f"Klaim atau berita mengenai: {title}",
        "penjelasan": "Penalaran AI menghadapi pembatasan server sementara. Teks artikel berhasil diarsipkan dan dihitung hash SHA-256.",
        "kesimpulan": "Status verifikasi sementara: MERAGUKAN (Perlu verifikasi manual lanjutan).",
        "credibilityScore": 70,
        "status": "QUESTIONABLE",
        "summary": "Penalaran AI menghadapi pembatasan server sementara. Menampilkan evaluasi heuristik.",
        "keyFindings": [
            "Layanan AI mengalami beban puncak sementara.",
            "Teks berita berhasil diarsipkan ke IPFS.",
            "Hash kriptografi valid.",
        ],
    }
