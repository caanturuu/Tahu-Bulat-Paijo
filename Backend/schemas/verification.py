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
    userAddress: Optional[str] = "0x0000000000000000000000000000000000000000"

class RescanRequest(BaseModel):
    url: str
    originalHash: str
    originalText: Optional[str] = None

class VerificationResult(BaseModel):
    url: str
    title: str
    publisher: Optional[str] = None
    publishedDate: Optional[str] = None
    articleHash: str
    credibilityScore: int = Field(ge=0, le=100)
    status: str  # "VALID" | "QUESTIONABLE" | "HOAX" | "NOT_NEWS"
    isNews: Optional[bool] = True
    notNewsReason: Optional[str] = None
    narasi: Optional[str] = None
    penjelasan: Optional[str] = None
    kesimpulan: Optional[str] = None
    summary: str
    keyFindings: List[str]
    claimsReview: List[FactCheckClaim]
    ipfsCid: str
    txHash: Optional[str] = None
    network: str = "Ethereum Sepolia"
    timestamp: str
    hasRevisions: Optional[bool] = False
    diffSummary: Optional[DiffSummary] = None
    verifyTicket: Optional[str] = None

class RescanResponse(BaseModel):
    url: str
    currentHash: str
    hasRevisions: bool
    diffSummary: DiffSummary

class RelayRequest(BaseModel):
    userAddress: str
    articleHash: str
    articleKey: Optional[str] = None
    url: Optional[str] = None
    credibilityScore: int = Field(ge=0, le=100)
    ipfsCid: str
    deadline: int
    signature: str
    verifyTicket: Optional[str] = None

class RelayResponse(BaseModel):
    status: str  # "success" | "duplicate_skipped"
    txHash: Optional[str] = None
    explorerUrl: Optional[str] = None
    blockNumber: Optional[int] = None
    recordId: Optional[int] = None
    articleKey: str
    remainingDailyQuota: Optional[int] = None

