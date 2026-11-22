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
  status: "VALID" | "QUESTIONABLE" | "HOAX" | "NOT_NEWS";
  isNews?: boolean;
  notNewsReason?: string;
  narasi?: string;          // Narasi / klaim isu yang beredar
  penjelasan?: string;      // Penjelasan detail fakta / bantahan
  kesimpulan?: string;      // Kesimpulan akhir
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
  verifyTicket?: string;
  recordId?: number;
  relayStatus?: "relaying" | "success" | "duplicate_skipped" | "failed";
  relayMessage?: string;
}

export interface HoaxArticleItem {
  id: string | number;
  title: string;
  category?: string;
  narasi?: string;
  penjelasan?: string;
  kesimpulan?: string;
  source_url?: string;
  image_url?: string;
  published_date?: string;
  created_at?: string;
  article_hash?: string;
  credibility_score?: number;
  status?: "VALID" | "QUESTIONABLE" | "HOAX" | "NOT_NEWS";
  key_findings?: string[];
  claims_review?: FactCheckClaim[];
  ipfs_cid?: string;
  tx_hash?: string;
}

export interface AuditHistoryItem {
  id: string | number;
  user_address?: string;
  article_url?: string;
  article_title: string;
  article_hash: string;
  credibility_score: number;
  status: string;
  ipfs_cid?: string;
  tx_hash?: string;
  created_at: string;
}

export type VerificationMode = "url" | "text" | "rescan";
