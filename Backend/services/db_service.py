from typing import Dict, Any, List, Optional
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """Initialize and return a singleton Supabase client using service role key."""
    global _client
    if _client is not None:
        return _client
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY or "your-project-id" in SUPABASE_URL:
        return None
    try:
        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        return _client
    except Exception as e:
        print(f"[Supabase] Client init error: {e}")
        return None

def save_audit_history(record: Dict[str, Any]) -> bool:
    """Save user verification record to user_audit_history table."""
    client = get_supabase_client()
    if not client:
        return False
    try:
        client.table("user_audit_history").insert(record).execute()
        return True
    except Exception as e:
        print(f"[Supabase] save_audit_history error: {e}")
        return False

def get_audit_history(limit: int = 50, user_address: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve recent verification history records for a specific user or email."""
    client = get_supabase_client()
    if not client:
        return []
    try:
        query = client.table("user_audit_history").select("*")
        if user_address and user_address.strip():
            raw = user_address.strip()
            addrs = [a.strip() for a in raw.split(",") if a.strip()]
            conditions = []
            for a in addrs:
                # Support exact match and substring match (e.g. if stored as email,wallet or queried by email only)
                conditions.append(f"user_address.eq.{a}")
                conditions.append(f"user_address.ilike.%{a}%")
            if conditions:
                query = query.or_(",".join(conditions))
        res = query.order("created_at", desc=True).limit(limit).execute()
        return res.data or []
    except Exception as e:
        print(f"[Supabase] get_audit_history error: {e}")
        return []

def get_hoax_articles(limit: int = 50, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve catalog of verified hoax articles for the card grid."""
    client = get_supabase_client()
    if not client:
        return []
    try:
        query = client.table("hoax_articles").select("*")
        if category and category.lower() != "semua":
            query = query.ilike("category", f"%{category}%")
        if search and search.strip():
            s = f"%{search.strip()}%"
            query = query.or_(f"title.ilike.{s},narasi.ilike.{s},category.ilike.{s}")
        res = query.order("created_at", desc=True).limit(limit).execute()
        return res.data or []
    except Exception as e:
        print(f"[Supabase] get_hoax_articles error: {e}")
        return []

def get_hoax_article_by_id(article_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve full verification details of a specific hoax article by UUID."""
    client = get_supabase_client()
    if not client:
        return None
    try:
        res = client.table("hoax_articles").select("*").eq("id", article_id).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
    except Exception as e:
        print(f"[Supabase] get_hoax_article_by_id error: {e}")
        return None
