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
  status: "VALID" | "QUESTIONABLE" | "HOAX";
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
}

export type VerificationMode = "url" | "text" | "rescan";
