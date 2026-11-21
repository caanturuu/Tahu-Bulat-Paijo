from typing import List, Dict, Any
import httpx
from config import FACT_CHECK_API_KEY

GOOGLE_FACT_CHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

async def search_fact_checks(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Search Google Fact Check Tools API for claims and reviews (ClaimReview Schema).
    Returns a normalized list of fact check claims.
    """
    if not FACT_CHECK_API_KEY:
        return []

    # Take the first 100 characters of query as search keywords to prevent query overflow
    keywords = query[:100].strip()
    params = {
        "query": keywords,
        "key": FACT_CHECK_API_KEY,
        "languageCode": "id",
        "pageSize": max_results,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GOOGLE_FACT_CHECK_URL, params=params)
            if response.status_code != 200:
                # Retry with general query without language code filter
                params.pop("languageCode", None)
                response = await client.get(GOOGLE_FACT_CHECK_URL, params=params)

            if response.status_code == 200:
                data = response.json()
                claims_raw = data.get("claims", [])
                results = []

                for item in claims_raw:
                    claim_text = item.get("text", "")
                    claimant = item.get("claimant", "Tidak disebutkan")
                    claim_date = item.get("claimDate", "")

                    reviews = item.get("claimReview", [])
                    if reviews:
                        review = reviews[0]
                        publisher_info = review.get("publisher", {})
                        publisher_name = publisher_info.get("name", "Konsorsium Cek Fakta")
                        review_url = review.get("url", "")
                        rating = review.get("textualRating", "Telah Diperiksa")

                        results.append({
                            "claim": claim_text,
                            "claimant": claimant,
                            "claimDate": claim_date,
                            "reviewPublisher": publisher_name,
                            "reviewUrl": review_url,
                            "rating": rating,
                        })

                return results
    except Exception as e:
        print(f"[FactCheckService] Error querying fact check API: {e}")

    return []
