import { VerificationResult } from "@/types";

export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function shortenHash(hash?: string, chars = 6): string {
  if (!hash) return "";
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "-";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
  } catch {
    return isoDate;
  }
}

export function getScoreStatusText(score: number): {
  text: string;
  colorClass: string;
  barColorClass: string;
} {
  if (score >= 71) {
    return {
      text: "Terverifikasi Benar",
      colorClass: "text-[#047857]",
      barColorClass: "bg-[#047857]",
    };
  }
  if (score >= 41) {
    return {
      text: "Meragukan",
      colorClass: "text-[#b45309]",
      barColorClass: "bg-[#b45309]",
    };
  }
  return {
    text: "Terindikasi Hoaks",
    colorClass: "text-[#be123c]",
    barColorClass: "bg-[#be123c]",
  };
}

export function getScoreBadge(score: number): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  if (score >= 71) {
    return {
      label: "Terverifikasi Valid",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-500/30",
    };
  }
  if (score >= 41) {
    return {
      label: "Perlu Verifikasi Lanjutan",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-700",
      borderColor: "border-amber-500/30",
    };
  }
  return {
    label: "Terindikasi Hoax",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-700",
    borderColor: "border-rose-500/30",
  };
}

/**
 * Simulasi Cerdas Deteksi Konten & Validasi Berita
 * Menghasilkan data pengujian untuk kategori:
 * 1. Meragukan (Default referensi Gambar 1 - "harga nasi naik 200%", skor 62)
 * 2. Hoaks (Skor 18, Terindikasi Hoaks)
 * 3. Benar (Skor 94, Terverifikasi Benar)
 */
export function simulateNewsValidation(query: string): VerificationResult {
  const cleanQuery = query.trim().replace(/^["']|["']$/g, "");
  const lower = cleanQuery.toLowerCase();
  const timestamp = new Date().toISOString();

  const mockHash = "0x7f83b1a89c2d4e6f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b6d9069";
  const mockIpfs = "QmZtmD2qJ9wXk8L5vP3mR7tY1uN4bE6c8d0e2f3h89AB";
  const mockTx = "0xa8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e234567";

  // Kasus 1: Terindikasi Hoaks
  const isHoax =
    lower.includes("hoax") ||
    lower.includes("hoaks") ||
    lower.includes("palsu") ||
    lower.includes("bohong") ||
    lower.includes("deepfake") ||
    lower.includes("subsidi bbm dicabut") ||
    lower.includes("bocor");

  if (isHoax) {
    return {
      url: cleanQuery.startsWith("http") ? cleanQuery : "",
      title: cleanQuery.startsWith("http") ? cleanQuery : cleanQuery,
      publisher: "Media Sosial & Saluran Daring Anonim",
      publishedDate: new Date(Date.now() - 3600000 * 3).toISOString(),
      articleHash: mockHash,
      credibilityScore: 18,
      status: "HOAX",
      summary: "Isu ini merupakan klaim fabrikasi yang tidak memiliki basis data faktual. Hasil penelusuran arsip regulasi dan konfirmasi lintas instansi menyatakan bahwa informasi yang beredar adalah manipulatif dan keliru.",
      keyFindings: [
        "Status: Terverifikasi sebagai kabar bohong yang direkayasa dan disebarkan tanpa rujukan resmi.",
        "Konteks faktual: Kementerian dan lembaga terkait telah merilis klarifikasi resmi membantah kebenaran narasi ini.",
        "Himbauan: Hentikan penyebaran informasi ini dan rujuk kanal komunikasi resmi instansi pemerintah.",
      ],
      claimsReview: [
        {
          claim: cleanQuery,
          claimant: "Pesan Berantai / Media Sosial Anonim",
          claimDate: new Date().toISOString().split("T")[0],
          reviewPublisher: "MAFINDO (TurnBackHoax)",
          reviewUrl: "https://turnbackhoax.id",
          rating: "Salah / Hoaks Pabrikasi",
        },
      ],
      ipfsCid: mockIpfs,
      txHash: mockTx,
      network: "Base Sepolia (Layer-2)",
      timestamp,
    };
  }

  // Kasus 2: Terverifikasi Benar
  const isValid =
    lower.includes("resmi") ||
    lower.includes("valid") ||
    lower.includes("benar") ||
    lower.includes("kemenkeu") ||
    lower.includes("presiden") ||
    lower.includes("pemerintah") ||
    lower.includes("apbn") ||
    lower.includes("bps") ||
    lower.includes("kompas") ||
    lower.includes("tempo");

  if (isValid) {
    return {
      url: cleanQuery.startsWith("http") ? cleanQuery : "",
      title: cleanQuery.startsWith("http") ? cleanQuery : cleanQuery,
      publisher: "Portal Berita Terakreditasi Dewan Pers",
      publishedDate: new Date(Date.now() - 3600000 * 2).toISOString(),
      articleHash: mockHash,
      credibilityScore: 94,
      status: "VALID",
      summary: "Klaim ini telah teruji kebenarannya berdasarkan data primer, dokumen keputusan kementerian, dan konfirmasi langsung dari narasumber pemangku kebijakan resmi.",
      keyFindings: [
        "Status: Terverifikasi selaras dengan siaran pers dan rilis regulasi kementerian terkait.",
        "Konteks faktual: Data statistik dan kronologi peristiwa sesuai dengan laporan resmi yang dipublikasikan.",
        "Himbauan: Informasi dapat dijadikan rujukan publik terpercaya dengan integritas data yang terjamin.",
      ],
      claimsReview: [
        {
          claim: cleanQuery,
          claimant: "Siaran Pers Pemerintah / Lembaga Negara",
          claimDate: new Date().toISOString().split("T")[0],
          reviewPublisher: "Konsorsium Media Terverifikasi Dewan Pers",
          reviewUrl: "https://dewanpers.or.id",
          rating: "Fakta Valid / Terkonfirmasi",
        },
      ],
      ipfsCid: mockIpfs,
      txHash: mockTx,
      network: "Base Sepolia (Layer-2)",
      timestamp,
    };
  }

  // Kasus 3: Meragukan (Default - sesuai persis dengan referensi Gambar 1: Harga nasi naik 200%)
  return {
    url: cleanQuery.startsWith("http") ? cleanQuery : "",
    title: cleanQuery.startsWith("http") ? cleanQuery : (cleanQuery || "Harga nasi naik 200%"),
    publisher: "media daring publik",
    publishedDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    articleHash: mockHash,
    credibilityScore: 62,
    status: "QUESTIONABLE",
    summary: "Isu ini punya sebagian dasar fakta: kebijakan terkait memang sedang dibahas. Namun narasi yang beredar menggeneralisasi, atau memuat konteks yang belum rampung diputuskan.",
    keyFindings: [
      "Status: Terdeteksi sebagai perbincangan kebijakan publik dan isu berita nasional.",
      "Konteks faktual: Ada wacana kebijakan terkait, tetapi petunjuk teknis pelaksanaannya belum diresmikan dalam lembaran negara.",
      "Himbauan: Tunggu pengumuman resmi. Jangan terburu-buru menyimpulkan kabar yang belum final.",
    ],
    claimsReview: [
      {
        claim: cleanQuery || "Harga nasi naik 200%",
        claimant: "Diskusi Media Daring Publik",
        claimDate: new Date().toISOString().split("T")[0],
        reviewPublisher: "Tempo Cek Fakta",
        reviewUrl: "https://cekfakta.tempo.co",
        rating: "Sebagian benar / belum final",
      },
    ],
    ipfsCid: mockIpfs,
    txHash: mockTx,
    network: "Base Sepolia (Layer-2)",
    timestamp,
  };
}
