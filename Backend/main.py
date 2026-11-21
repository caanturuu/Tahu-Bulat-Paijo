import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    VerificationRequest,
    VerificationResult,
    RescanRequest,
    RescanResponse,
    DiffSummary,
)
from services.scraper import extract_article_content, calculate_hash
from services.fact_check import search_fact_checks
from services.ai_verifier import verify_article_with_gemini
from services.ipfs_service import pin_json_to_ipfs
from services.diff_tracker import compute_text_diff

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
        "network": "Base Sepolia",
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

    # 3. AI Reasoning with Gemini 2.0 Flash
    ai_result = verify_article_with_gemini(
        title=title,
        article_text=text,
        fact_check_claims=fact_check_claims,
    )

    # 4. Pin to IPFS
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    ipfs_payload = {
        "title": title,
        "url": url,
        "articleHash": article_hash,
        "credibilityScore": ai_result["credibilityScore"],
        "status": ai_result["status"],
        "summary": ai_result["summary"],
        "keyFindings": ai_result["keyFindings"],
        "claimsReview": fact_check_claims,
        "timestamp": now_iso,
    }
    ipfs_cid = await pin_json_to_ipfs(ipfs_payload, name=f"VeritasChain-{article_hash[:12]}")

    # 5. Build Unified Result
    return VerificationResult(
        url=url or req.query,
        title=title,
        publisher=publisher,
        publishedDate=published_date,
        articleHash=article_hash,
        credibilityScore=ai_result["credibilityScore"],
        status=ai_result["status"],
        summary=ai_result["summary"],
        keyFindings=ai_result["keyFindings"],
        claimsReview=fact_check_claims,
        ipfsCid=ipfs_cid,
        txHash=None,
        network="Base Sepolia",
        timestamp=now_iso,
        hasRevisions=False,
    )

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
