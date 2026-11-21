from typing import List, Optional
from pydantic import BaseModel, Field

class FactCheckClaim(BaseModel):
    claim: str
    claimant: str
    claimDate: Optional[str] = None
    reviewPublisher: str
    reviewUrl: str
    rating: str

class DiffSummary(BaseModel):
    addedWords: int = 0
    removedWords: int = 0
    diffHtml: Optional[str] = None

class VerificationRequest(BaseModel):
    query: str
    mode: Optional[str] = "url"  # "url" | "text"

class RescanRequest(BaseModel):
    url: str
    originalHash: str

class VerificationResult(BaseModel):
    url: str
    title: str
    publisher: Optional[str] = None
    publishedDate: Optional[str] = None
    articleHash: str
    credibilityScore: int = Field(ge=0, le=100)
    status: str  # "VALID" | "QUESTIONABLE" | "HOAX"
    summary: str
    keyFindings: List[str]
    claimsReview: List[FactCheckClaim]
    ipfsCid: str
    txHash: Optional[str] = None
    network: str = "Ethereum Sepolia"
    timestamp: str
    hasRevisions: Optional[bool] = False
    diffSummary: Optional[DiffSummary] = None

class RescanResponse(BaseModel):
    url: str
    currentHash: str
    hasRevisions: bool
    diffSummary: DiffSummary
