# VeritasChain — REST API Specification

Dokumentasi spesifikasi lengkap endpoint REST API backend **VeritasChain** (FastAPI).

* **Base URL Lokal**: `http://localhost:8000`
* **Swagger UI (Dokumentasi Interaktif)**: `http://localhost:8000/docs`
* **OpenAPI Schema (JSON)**: `http://localhost:8000/openapi.json`
* **Default Content-Type**: `application/json`

---

## Daftar Endpoint

| No | Method | Endpoint | Deskripsi | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/` | Health check & info status layanan backend | `200 OK` |
| 2 | `POST` | `/api/verify` | Ekstraksi, cek fakta (ClaimReview), reasoning AI, & IPFS | `200 OK`, `400 Bad Request` |
| 3 | `POST` | `/api/rescan` | Pelacakan revisi teks artikel & perbandingan visual diff | `200 OK`, `400 Bad Request` |
| 4 | `POST` | `/api/relay` | Gasless meta-transaction relayer ke Base Sepolia | `200 OK`, `400 Bad Request`, `500 Internal Error` |
| 5 | `GET` | `/api/audit/{article_hash}` | Mengambil bukti verifikasi publik berdasarkan SHA-256 | `200 OK`, `404 Not Found` |

---

## 1. Health Check
Memeriksa apakah server backend FastAPI aktif dan terhubung ke jaringan.

* **URL**: `/`
* **Method**: `GET`
* **Headers**: `None`

#### Response (`200 OK`):
```json
{
  "service": "VeritasChain Backend API",
  "status": "operational",
  "version": "1.0.0",
  "network": "Base Sepolia"
}
```

---

## 2. Verifikasi Kredibilitas Berita (Core AI Pipeline)
Menerima tautan URL berita atau teks panjang, melakukan ekstraksi konten bersih, query database sanggahan resmi, penalaran semantik via Gemini 2.0 Flash, dan pengarsipan snapshot ke IPFS via Pinata.

* **URL**: `/api/verify`
* **Method**: `POST`
* **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body:
```json
{
  "query": "https://www.kompas.com/cekfakta/read/2026/03/15/klarifikasi-isu-vaksin",
  "mode": "url"
}
```
*Field Details*:
* `query` *(string, wajib)*: Tautan URL artikel berita atau teks berita langsung.
* `mode` *(string, opsional)*: `"url"` atau `"text"` (default: `"url"`).

#### Response (`200 OK`):
```json
{
  "url": "https://www.kompas.com/cekfakta/read/2026/03/15/klarifikasi-isu-vaksin",
  "title": "Klarifikasi Isu Vaksin dan Dampak Kesehatan",
  "publisher": "Kompas.com",
  "publishedDate": "2026-03-15T08:30:00Z",
  "articleHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "credibilityScore": 92,
  "status": "VALID",
  "summary": "Artikel ini menyajikan data ilmiah yang sesuai dengan rilis resmi Kementerian Kesehatan dan WHO. Kutipan narasumber terverifikasi dan tidak ditemukan manipulasi konteks.",
  "keyFindings": [
    "Data uji klinis selaras dengan laporan resmi Kemenkes RI.",
    "Konteks kutipan epidemiolog dikutip secara utuh tanpa pemotongan.",
    "Tidak ditemukan tanda-tanda fabrikasi narasi atau disinformasi."
  ],
  "claimsReview": [
    {
      "claim": "Klaim efek samping ekstrem vaksin X di masyarakat",
      "claimant": "Akun Media Sosial Viral",
      "claimDate": "2026-03-14",
      "reviewPublisher": "TurnBackHoax MAFINDO",
      "reviewUrl": "https://turnbackhoax.id/2026/03/14/salah-isu-vaksin/",
      "rating": "Salah / Disinformasi"
    }
  ],
  "ipfsCid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "txHash": null,
  "network": "Base Sepolia",
  "timestamp": "2026-11-21T14:10:00Z",
  "hasRevisions": false,
  "diffSummary": null
}
```

#### Error Response (`400 Bad Request`):
```json
{
  "detail": "Query cannot be empty."
}
```

---

## 3. Pelacakan Perubahan Berita (Article Change Tracking)
Mengambil ulang (*re-scrape*) artikel live dari URL yang sama, menghitung ulang hash SHA-256 saat ini, membandingkannya dengan hash awal on-chain/IPFS, serta menghasilkan visual diff red/green jika terjadi perubahan.

* **URL**: `/api/rescan`
* **Method**: `POST`
* **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body:
```json
{
  "url": "https://news-portal.com/artikel-tertentu",
  "originalHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
}
```

#### Response (`200 OK` - Terdeteksi Perubahan):
```json
{
  "url": "https://news-portal.com/artikel-tertentu",
  "currentHash": "9b12c84298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b111",
  "hasRevisions": true,
  "diffSummary": {
    "addedWords": 14,
    "removedWords": 6,
    "diffHtml": "<span>Pernyataan awal <span class=\"bg-red-500/20 text-red-400 line-through px-1 rounded mx-0.5\">dibantah keras</span> telah diubah menjadi <span class=\"bg-emerald-500/20 text-emerald-400 underline decoration-emerald-500 px-1 rounded mx-0.5\">masih dalam kajian internal</span> oleh redaksi.</span>"
  }
}
```

#### Response (`200 OK` - Tidak Ada Perubahan):
```json
{
  "url": "https://news-portal.com/artikel-tertentu",
  "currentHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "hasRevisions": false,
  "diffSummary": {
    "addedWords": 0,
    "removedWords": 0,
    "diffHtml": null
  }
}
```

---

## 4. Gasless Meta-Transaction Relayer
Menerima payload bukti verifikasi yang telah ditandatangani pengguna menggunakan standar EIP-712 (tanpa gas), lalu backend membayarkan gas untuk mencatatkannya ke Smart Contract di Base Sepolia L2.

* **URL**: `/api/relay`
* **Method**: `POST`
* **Headers**:
  ```http
  Content-Type: application/json
  ```

#### Request Body:
```json
{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "articleHash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "credibilityScore": 92,
  "ipfsCid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "signature": "0x3045022100a1b2c3..."
}
```

#### Response (`200 OK`):
```json
{
  "status": "success",
  "txHash": "0x4b7c1289fe2134567890abcdef1234567890abcdef1234567890abcdef123456",
  "explorerUrl": "https://sepolia.basescan.org/tx/0x4b7c1289fe2134567890abcdef1234567890abcdef1234567890abcdef123456",
  "blockNumber": 18923412
}
```

---

## 5. Audit Publik Berdasarkan Hash Artikel
Mengambil data riwayat verifikasi artikel yang telah tercatat dari IPFS/database untuk keperluan audit pihak ketiga.

* **URL**: `/api/audit/{article_hash}`
* **Method**: `GET`

#### Response (`200 OK`):
```json
{
  "articleHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "title": "Klarifikasi Isu Vaksin dan Dampak Kesehatan",
  "credibilityScore": 92,
  "status": "VALID",
  "ipfsCid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "txHash": "0x4b7c1289fe213456...",
  "verifiedAt": "2026-11-21T14:10:00Z"
}
```

---

## Contoh Pengujian dengan cURL

```bash
# 1. Health check
curl -X GET "http://localhost:8000/"

# 2. Verifikasi artikel
curl -X POST "http://localhost:8000/api/verify" \
     -H "Content-Type: application/json" \
     -d '{"query": "https://turnbackhoax.id/artikel-sampel", "mode": "url"}'

# 3. Rescan artikel
curl -X POST "http://localhost:8000/api/rescan" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://turnbackhoax.id/artikel-sampel", "originalHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}'
```
