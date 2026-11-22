import asyncio
import base64
import datetime
import hashlib
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Header, HTTPException, BackgroundTasks
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
from services.relayer import (
    ticket_store,
    relay_verification,
    get_relayer_status,
    get_onchain_status,
    get_onchain_record,
    get_verifier_nonce,
    check_onchain_article_change,
    derive_article_key,
)

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

def compute_deterministic_cid(payload: Dict[str, Any]) -> str:
    """Generate standard IPFS CIDv1 raw multihash instantly in memory."""
    raw = json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")
    h = hashlib.sha256(raw).digest()
    cid_bytes = bytes([0x01, 0x55, 0x12, 0x20]) + h
    b32 = base64.b32encode(cid_bytes).decode("ascii").rstrip("=").lower()
    return f"b{b32}"

# High-speed in-memory verification cache
_VERIFY_CACHE: Dict[str, VerificationResult] = {}
_TEXT_SNAPSHOTS: Dict[str, str] = {}

def _init_cache_from_hoaxes():
    """Pre-warm cache with seeded hoax articles so instant responses are returned for popular claims."""
    try:
        from scripts.seed_hoax_articles import REAL_HOAX_ARTICLES
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        for h in REAL_HOAX_ARTICLES:
            title = h.get("title", "")
            raw_hash = (h.get("article_hash") or "").strip().lower().replace("0x", "")
            if len(raw_hash) == 64:
                art_hash = f"0x{raw_hash}"
            else:
                art_hash = "0x" + hashlib.sha256(title.encode("utf-8")).hexdigest()
            cid = h.get("ipfs_cid") or f"bafkrei{art_hash[2:54]}"
            ticket = ticket_store.issue(
                article_hash=art_hash,
                ipfs_cid=cid,
                credibility_score=h.get("credibility_score", 0),
                metadata={
                    "title": title,
                    "status": h.get("status", "HOAX"),
                    "summary": h.get("kesimpulan", ""),
                    "keyFindings": h.get("key_findings", []),
                    "claimsReview": h.get("claims_review", []),
                }
            )
            res = VerificationResult(
                url=h.get("source_url") or title,
                title=title,
                publisher="Pemeriksa Fakta Terverifikasi",
                publishedDate="",
                articleHash=art_hash,
                credibilityScore=h.get("credibility_score", 0),
                status=h.get("status", "HOAX"),
                isNews=True,
                notNewsReason=None,
                narasi=h.get("narasi", ""),
                penjelasan=h.get("penjelasan", ""),
                kesimpulan=h.get("kesimpulan", ""),
                summary=h.get("kesimpulan", ""),
                keyFindings=h.get("key_findings", []),
                claimsReview=h.get("claims_review", []),
                ipfsCid=cid,
                txHash=h.get("tx_hash"),
                network="Ethereum Sepolia",
                timestamp=now_iso,
                hasRevisions=False,
                verifyTicket=ticket,
            )
            _VERIFY_CACHE[title.strip().lower()] = res
    except Exception as e:
        print(f"[Cache] Seed cache init note: {e}")

_init_cache_from_hoaxes()

@app.get("/")
def read_root():
    return {
        "service": "VeritasChain Backend API",
        "status": "operational",
        "version": "1.0.0",
        "network": "Ethereum Sepolia",
    }

@app.post("/api/verify", response_model=VerificationResult)
async def verify_article(req: VerificationRequest, background_tasks: BackgroundTasks):
    """
    Main verification pipeline optimized for sub-second / 1-2s latency:
    1. Scrape clean body text & calculate deterministic normalized SHA-256
    2. Check fast memory cache for repeated claims
    3. Query Google Fact Check Tools API for official debunks (ClaimReview)
    4. Perform semantic analysis & scoring via Gemini 3.5 Flash (async thread)
    5. Issue deterministic IPFS CID & gasless relay ticket immediately
    6. Asynchronously archive snapshot to IPFS via Pinata & save history to Supabase
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    query_clean = req.query.strip()
    norm_query = query_clean.lower()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    is_url = query_clean.startswith("http://") or query_clean.startswith("https://")

    # Fast cache lookup: Exact or strong substring match
    if norm_query in _VERIFY_CACHE:
        cached = _VERIFY_CACHE[norm_query]
        ticket = ticket_store.issue(
            article_hash=cached.articleHash,
            ipfs_cid=cached.ipfsCid,
            credibility_score=cached.credibilityScore,
            metadata={
                "title": cached.title,
                "status": cached.status,
                "summary": cached.summary,
                "keyFindings": cached.keyFindings,
                "claimsReview": cached.claimsReview,
            }
        )
        background_tasks.add_task(save_audit_history, {
            "user_address": req.userAddress or "0x0000000000000000000000000000000000000000",
            "article_title": cached.title,
            "query_input": req.query,
            "article_hash": cached.articleHash,
            "credibility_score": cached.credibilityScore,
            "status": cached.status,
            "is_news": True,
            "not_news_reason": None,
            "tx_hash": cached.txHash,
            "ipfs_cid": cached.ipfsCid,
            "network": "Ethereum Sepolia",
        })
        return cached.model_copy(update={"timestamp": now_iso, "verifyTicket": ticket})

    for cached_title, cached_res in _VERIFY_CACHE.items():
        if len(norm_query) > 15 and (norm_query in cached_title or cached_title in norm_query):
            ticket = ticket_store.issue(
                article_hash=cached_res.articleHash,
                ipfs_cid=cached_res.ipfsCid,
                credibility_score=cached_res.credibilityScore,
                metadata={
                    "title": cached_res.title,
                    "status": cached_res.status,
                    "summary": cached_res.summary,
                    "keyFindings": cached_res.keyFindings,
                    "claimsReview": cached_res.claimsReview,
                }
            )
            background_tasks.add_task(save_audit_history, {
                "user_address": req.userAddress or "0x0000000000000000000000000000000000000000",
                "article_title": cached_res.title,
                "query_input": req.query,
                "article_hash": cached_res.articleHash,
                "credibility_score": cached_res.credibilityScore,
                "status": cached_res.status,
                "is_news": True,
                "not_news_reason": None,
                "tx_hash": cached_res.txHash,
                "ipfs_cid": cached_res.ipfsCid,
                "network": "Ethereum Sepolia",
            })
            return cached_res.model_copy(update={"timestamp": now_iso, "verifyTicket": ticket})

    # Quick heuristic check for non-news (extremely short greetings / test inputs)
    if not is_url and len(query_clean) < 10:
        clean_hash = calculate_hash(query_clean)
        background_tasks.add_task(save_audit_history, {
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
        short_res = VerificationResult(
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
        _VERIFY_CACHE[norm_query] = short_res
        return short_res

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

    _TEXT_SNAPSHOTS[article_hash.lower().removeprefix("0x")] = text

    # 2. Fact Check Search (MAFINDO, Kompas, Tempo, AFP via ClaimReview)
    fact_check_claims = await search_fact_checks(title or text[:100])

    # 3. AI Reasoning & Content Classification with Gemini (Offloaded to worker thread)
    ai_result = await asyncio.to_thread(
        verify_article_with_gemini,
        title=title,
        article_text=text,
        fact_check_claims=fact_check_claims,
    )

    # If classified as NOT news, return dedicated non-news verification response
    if not ai_result.get("isNews", True):
        background_tasks.add_task(save_audit_history, {
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
        not_news_res = VerificationResult(
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
        _VERIFY_CACHE[norm_query] = not_news_res
        return not_news_res

    # 4. Pin Snapshot to Pinata IPFS (await real IpfsHash so gateway link matches; fallback to local CIDv1 if unavailable)
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
    pinned_cid = await pin_json_to_ipfs(ipfs_payload, f"VeritasChain-{article_hash[:12]}")
    ipfs_cid = (
        pinned_cid.strip()
        if isinstance(pinned_cid, str) and pinned_cid.strip()
        else compute_deterministic_cid(ipfs_payload)
    )

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

    # Non-blocking async persistence via FastAPI BackgroundTasks
    background_tasks.add_task(save_audit_history, {
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
    final_res = VerificationResult(
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
    _VERIFY_CACHE[norm_query] = final_res
    return final_res

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

@app.get("/api/chain/status")
def read_chain_status():
    """Retrieve on-chain contract state, deployment info, and total records from Ethereum Sepolia."""
    return get_onchain_status()

@app.get("/api/chain/records/{record_id}")
def read_chain_record(record_id: int):
    """Retrieve a verified verification record directly from the smart contract on Sepolia."""
    return get_onchain_record(record_id)

@app.get("/api/chain/nonce/{address}")
def read_chain_nonce(address: str):
    """Retrieve the current EIP-712 nonce and contract metadata for a verifier address."""
    return get_verifier_nonce(address)

@app.get("/api/history")
def read_audit_history(limit: int = 50, user_address: Optional[str] = None):
    """Retrieve audit history from Supabase table user_audit_history for authenticated user."""
    if not user_address or not user_address.strip():
        return []
    return get_audit_history(limit=limit, user_address=user_address.strip())

@app.get("/api/hoax-articles")
def read_hoax_articles(limit: int = 50, category: Optional[str] = None, q: Optional[str] = None):
    """Retrieve catalog of hoax articles from Supabase table hoax_articles."""
    return get_hoax_articles(limit=limit, category=category, search=q)

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
    3. Cross-reference on-chain with VeritasChain contract checkArticleChange
    4. Generate visual red/green diff if modified
    """
    if not req.url:
        raise HTTPException(status_code=400, detail="Article URL is required.")

    current_data = extract_article_content(req.url)
    current_hash = current_data["articleHash"]
    norm_current = current_hash.strip().lower().removeprefix("0x")
    norm_original = req.originalHash.strip().lower().removeprefix("0x")
    has_revisions = norm_current != norm_original

    # Synchronize with on-chain contract state if available
    try:
        article_key_hex = derive_article_key(None, req.url, req.originalHash)
        onchain_change = check_onchain_article_change(article_key_hex, current_hash)
        if onchain_change.get("exists"):
            has_revisions = bool(onchain_change.get("modified"))
    except Exception as exc:
        print(f"[Rescan] On-chain checkArticleChange fallback: {exc}")

    diff_summary = DiffSummary()
    if has_revisions:
        baseline_text = req.originalText or _TEXT_SNAPSHOTS.get(req.originalHash.lower().removeprefix("0x"))
        if baseline_text:
            diff_data = compute_text_diff(baseline_text, current_data.get("text", ""))
            diff_summary = DiffSummary(**diff_data)
        else:
            diff_summary = DiffSummary(
                addedWords=0,
                removedWords=0,
                diffHtml="<span>Hash artikel berubah di halaman live, namun teks awal tidak tersedia untuk perbandingan kata.</span>",
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

