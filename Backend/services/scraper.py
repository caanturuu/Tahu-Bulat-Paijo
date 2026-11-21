import hashlib
import re
from typing import Tuple, Dict, Any, Optional
import trafilatura

def normalize_text(text: str) -> str:
    """Normalize text by collapsing whitespace and stripping control characters."""
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def calculate_hash(text: str) -> str:
    """Compute deterministic SHA-256 hash from normalized text."""
    normalized = normalize_text(text)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

def extract_article_content(url_or_text: str) -> Dict[str, Any]:
    """
    Extract clean article text and metadata.
    Supports live URL scraping via trafilatura, or direct plain-text fallback.
    """
    is_url = url_or_text.startswith("http://") or url_or_text.startswith("https://")

    if is_url:
        downloaded = trafilatura.fetch_url(url_or_text)
        if downloaded:
            extracted_text = trafilatura.extract(
                downloaded,
                include_comments=False,
                include_tables=False,
                no_fallback=False,
            )
            metadata = trafilatura.extract_metadata(downloaded)

            title = metadata.title if metadata and metadata.title else "Untitled Article"
            publisher = metadata.sitename if metadata and metadata.sitename else ""
            published_date = metadata.date if metadata and metadata.date else ""
            clean_text = normalize_text(extracted_text) if extracted_text else ""
            article_hash = calculate_hash(clean_text)

            return {
                "is_url": True,
                "url": url_or_text,
                "title": title,
                "publisher": publisher,
                "publishedDate": published_date,
                "text": clean_text,
                "articleHash": article_hash,
            }

    # Plain text fallback
    clean_text = normalize_text(url_or_text)
    words = clean_text.split()
    title = " ".join(words[:10]) + ("..." if len(words) > 10 else "")
    article_hash = calculate_hash(clean_text)

    return {
        "is_url": False,
        "url": "",
        "title": title or "Teks Berita Langsung",
        "publisher": "Input Manual",
        "publishedDate": "",
        "text": clean_text,
        "articleHash": article_hash,
    }
