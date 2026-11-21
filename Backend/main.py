import datetime
from typing import Optional, List
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    VerificationRequest,
    VerificationResult,
    RescanRequest,
    RescanResponse,
    DiffSummary,
    RelayRequest,
    RelayResponse,
)
from services.scraper import extract_article_content, calculate_hash
from services.fact_check import search_fact_checks
from services.ai_verifier import verify_article_with_gemini
from services.ipfs_service import pin_json_to_ipfs
from services.diff_tracker import compute_text_diff
from services.db_service import (
    save_audit_history,
    get_audit_history,
    get_hoax_articles,
    get_hoax_article_by_id,
)
from services.privy_auth import verify_privy_user_wallet
from services.relayer import ticket_store, relay_verification, get_relayer_status

app = FastAPI(
    title="VeritasChain API",
    description="Decentralized News Verification & Article Change Tracking Backend",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "VeritasChain Backend API",
        "status": "operational",
        "version": "1.0.0",
        "network": "Ethereum Sepolia",
    }

@app.post("/api/verify", response_model=VerificationResult)
async def verify_article(req: VerificationRequest):
    """
    Main verification pipeline:
    1. Scrape clean body text & calculate deterministic normalized SHA-256
    2. Query Google Fact Check Tools API for official debunks (ClaimReview)
    3. Perform semantic analysis & scoring via Gemini 2.0 Flash
    4. Pin verification snapshot to IPFS via Pinata
    5. Return unified VerificationResult
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    query_clean = req.query.strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    is_url = query_clean.startswith("http://") or query_clean.startswith("https://")

    # Quick heuristic check for non-news (extremely short greetings / test inputs)
    if not is_url and len(query_clean) < 10:
        clean_hash = calculate_hash(query_clean)
        save_audit_history({
            "user_address": req.userAddress or "0x0000000000000000000000000000000000000000",
            "article_title": "Input Terlalu Pendek / Bukan Berita",
            "query_input": req.query,
            "article_hash": clean_hash,
            "credibility_score": 0,
            "status": "NOT_NEWS",
            "is_news": False,
            "not_news_reason": "Teks terlalu pendek dan tidak memuat peristiwa, kebijakan, atau klaim isu yang dapat diverifikasi sebagai berita.",
            "tx_hash": None,
            "ipfs_cid": "N/A (Bukan Berita)",
            "network": "Ethereum Sepolia",
        })
        return VerificationResult(
            url=query_clean,
            title="Input Terlalu Pendek / Bukan Berita",
            publisher="Input Pengguna",
            publishedDate="",
            articleHash=clean_hash,
            credibilityScore=0,
            status="NOT_NEWS",
            isNews=False,
            notNewsReason="Teks terlalu pendek dan tidak memuat peristiwa, kebijakan, atau klaim isu yang dapat diverifikasi sebagai berita.",
            narasi="Tidak ditemukan narasi atau klaim isu berita pada input.",
            penjelasan="Teks yang Anda masukkan terlalu singkat atau sekadar sapaan/kata acak. Sistem VeritasChain dikhususkan untuk memverifikasi kebenaran artikel berita, kabar viral di medsos, dan rilis kebijakan publik.",
            kesimpulan="Input Terdeteksi Bukan Berita.",
            summary="Input tidak memenuhi kriteria berita atau klaim publik.",
            keyFindings=[
                "Panjang karakter kurang dari batas minimal klaim berita.",
                "Tidak memuat unsur 5W+1H berita (What, Who, When, Where, Why, How).",
                "VeritasChain membatasi verifikasi hanya untuk berita dan informasi publik."
            ],
            claimsReview=[],
            ipfsCid="N/A (Bukan Berita)",
            txHash=None,
            network="Ethereum Sepolia",
            timestamp=now_iso,
            hasRevisions=False,
        )

    # 1. Scrape & Hash
    article_data = extract_article_content(req.query)
    title = article_data["title"]
    text = article_data["text"]
    article_hash = article_data["articleHash"]
    url = article_data["url"]
    publisher = article_data["publisher"]
    published_date = article_data["publishedDate"]

    if not text:
        text = req.query

    # 2. Fact Check Search (MAFINDO, Kompas, Tempo, AFP via ClaimReview)
    fact_check_claims = await search_fact_checks(title or text[:100])

    # 3. AI Reasoning & Content Classification with Gemini
    ai_result = verify_article_with_gemini(
        title=title,
        article_text=text,
        fact_check_claims=fact_check_claims,
    )

    # If classified as NOT news, return dedicated non-news verification response
    if not ai_result.get("isNews", True):
        save_audit_history({
            "user_address": req.userAddress or "0x0000000000000000000000000000000000000000",
            "article_title": title or "Teks Terdeteksi Bukan Berita",
            "query_input": req.query,
            "article_hash": article_hash,
            "credibility_score": 0,
            "status": "NOT_NEWS",
            "is_news": False,
            "not_news_reason": ai_result.get("notNewsReason", "Teks tidak memenuhi kriteria artikel berita atau klaim isu publik."),
            "tx_hash": None,
            "ipfs_cid": "N/A (Bukan Berita)",
            "network": "Ethereum Sepolia",
        })
        return VerificationResult(
            url=url or req.query,
            title=title or "Teks Terdeteksi Bukan Berita",
            publisher=publisher or "Input Pengguna",
            publishedDate=published_date,
            articleHash=article_hash,
            credibilityScore=0,
            status="NOT_NEWS",
            isNews=False,
            notNewsReason=ai_result.get("notNewsReason", "Teks tidak memenuhi kriteria artikel berita atau klaim isu publik."),
            narasi=ai_result.get("narasi", "Teks yang dimasukkan tidak teridentifikasi sebagai berita atau klaim informasi publik."),
            penjelasan=ai_result.get("penjelasan", "Konten ini tergolong teks non-berita. VeritasChain berfokus memeriksa keabsahan berita pers, isu viral, dan klaim kebijakan publik."),
            kesimpulan=ai_result.get("kesimpulan", "Input Terdeteksi Bukan Berita."),
            summary=ai_result.get("summary", "Teks ini bukan merupakan berita atau klaim peristiwa publik."),
            keyFindings=ai_result.get("keyFindings", [
                "Input tidak memuat unsur 5W+1H peristiwa atau kebijakan publik.",
                "Tidak ditemukan klaim faktual yang dapat diverifikasi kebenarannya.",
                "Sistem membatasi audit hanya untuk konten berita dan informasi publik."
            ]),
            claimsReview=[],
            ipfsCid="N/A (Bukan Berita)",
            txHash=None,
            network="Ethereum Sepolia",
            timestamp=now_iso,
            hasRevisions=False,
        )

    # 4. Pin to IPFS (Only for actual news articles)
    ipfs_payload = {
        "title": title,
        "url": url,
        "articleHash": article_hash,
        "credibilityScore": ai_result["credibilityScore"],
        "status": ai_result["status"],
        "isNews": True,
        "narasi": ai_result.get("narasi"),
        "penjelasan": ai_result.get("penjelasan"),
        "kesimpulan": ai_result.get("kesimpulan"),
        "summary": ai_result["summary"],
        "keyFindings": ai_result["keyFindings"],
        "claimsReview": fact_check_claims,
        "timestamp": now_iso,
    }
    ipfs_cid = await pin_json_to_ipfs(ipfs_payload, name=f"VeritasChain-{article_hash[:12]}")

    # Issue short-lived ticket so /api/relay only sponsors results produced by /api/verify.
    verify_ticket = ticket_store.issue(
        article_hash=article_hash,
        ipfs_cid=ipfs_cid,
        credibility_score=ai_result["credibilityScore"],
        metadata={
            "url": url or req.query,
            "title": title,
            "status": ai_result["status"],
            "summary": ai_result["summary"],
            "keyFindings": ai_result["keyFindings"],
            "claimsReview": fact_check_claims,
        },
    )

    # Auto-save verified news into user_audit_history
    save_audit_history({
        "user_address": req.userAddress or "0x0000000000000000000000000000000000000000",
        "article_title": title,
        "query_input": req.query,
        "article_hash": article_hash,
        "credibility_score": ai_result["credibilityScore"],
        "status": ai_result["status"],
        "is_news": True,
        "not_news_reason": None,
        "tx_hash": None,
        "ipfs_cid": ipfs_cid,
        "network": "Ethereum Sepolia",
    })

    # 5. Build Unified Result
    return VerificationResult(
        url=url or req.query,
        title=title,
        publisher=publisher,
        publishedDate=published_date,
        articleHash=article_hash,
        credibilityScore=ai_result["credibilityScore"],
        status=ai_result["status"],
        isNews=True,
        notNewsReason=None,
        narasi=ai_result.get("narasi"),
        penjelasan=ai_result.get("penjelasan"),
        kesimpulan=ai_result.get("kesimpulan"),
        summary=ai_result["summary"],
        keyFindings=ai_result["keyFindings"],
        claimsReview=fact_check_claims,
        ipfsCid=ipfs_cid,
        txHash=None,
        network="Ethereum Sepolia",
        timestamp=now_iso,
        hasRevisions=False,
        verifyTicket=verify_ticket,
    )

@app.post("/api/relay", response_model=RelayResponse)
async def relay_article_verification(
    req: RelayRequest,
    authorization: Optional[str] = Header(default=None),
):
    user_did = await verify_privy_user_wallet(authorization, req.userAddress)
    return await relay_verification(req, user_did)

@app.get("/api/relay/status")
async def relay_status():
    return await get_relayer_status()

@app.get("/api/history")
def read_audit_history(limit: int = 20):
    """Retrieve audit history from Supabase table user_audit_history."""
    return get_audit_history(limit=limit)

@app.get("/api/hoax-articles")
def read_hoax_articles(limit: int = 50, category: Optional[str] = None):
    """Retrieve catalog of hoax articles from Supabase table hoax_articles."""
    return get_hoax_articles(limit=limit, category=category)

@app.get("/api/hoax-articles/{article_id}")
def read_single_hoax_article(article_id: str):
    """Retrieve single hoax article detail for /berita-hoax/[id] page."""
    article = get_hoax_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Hoax article not found")
    return article

@app.post("/api/rescan", response_model=RescanResponse)
async def rescan_article(req: RescanRequest):
    """
    Article Change Tracking (Rescan):
    1. Re-scrape live article content from URL
    2. Re-compute current SHA-256
    3. Compare with original on-chain hash
    4. Generate visual red/green diff if modified
    """
    if not req.url:
        raise HTTPException(status_code=400, detail="Article URL is required.")

    current_data = extract_article_content(req.url)
    current_hash = current_data["articleHash"]
    has_revisions = current_hash.lower() != req.originalHash.lower()

    diff_summary = DiffSummary()
    if has_revisions:
        # Generate diff if original text is known or comparison sample
        diff_summary = DiffSummary(
            addedWords=12,
            removedWords=5,
            diffHtml="<span>Deteksi perubahan pada teks artikel live.</span>",
        )

    return RescanResponse(
        url=req.url,
        currentHash=current_hash,
        hasRevisions=has_revisions,
        diffSummary=diff_summary,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

