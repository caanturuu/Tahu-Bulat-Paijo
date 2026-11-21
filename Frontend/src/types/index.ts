export interface FactCheckClaim {
  claim: string;
  claimant: string;
  claimDate?: string;
  reviewPublisher: string;
  reviewUrl: string;
  rating: string;
}

export interface VerificationResult {
  url: string;
  title: string;
  publisher?: string;
  publishedDate?: string;
  articleHash: string;
  credibilityScore: number; // 0 - 100
  status: "VALID" | "QUESTIONABLE" | "HOAX" | "NON_NEWS";
  summary: string;
  keyFindings: string[];
  claimsReview: FactCheckClaim[];
  ipfsCid: string;
  txHash?: string;
  network: string;
  timestamp: string;
  hasRevisions?: boolean;
  diffSummary?: {
    addedWords: number;
    removedWords: number;
    diffHtml?: string;
  };
  // News validation / classification fields
  isNews?: boolean;
  contentType?: "BERITA" | "BUKAN_BERITA";
  validationReason?: string;
  nonNewsDetails?: {
    queryType?: string;
    suggestion?: string;
  };
}

export type VerificationMode = "url" | "text" | "rescan";
