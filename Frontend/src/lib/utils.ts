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
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
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
      colorClass: "text-emerald-700 dark:text-emerald-400",
      barColorClass: "bg-emerald-600",
    };
  }
  if (score >= 41) {
    return {
      text: "Konten Menyesatkan",
      colorClass: "text-amber-700 dark:text-amber-400",
      barColorClass: "bg-amber-500",
    };
  }
  return {
    text: "Terindikasi Hoaks",
    colorClass: "text-rose-700 dark:text-rose-400",
    barColorClass: "bg-rose-600",
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
      label: "Konten Menyesatkan (Misleading)",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-700",
      borderColor: "border-amber-500/30",
    };
  }
  return {
    label: "Terindikasi Hoaks (False)",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-700",
    borderColor: "border-rose-500/30",
  };
}

/**
 * Simulasi Cerdas Deteksi Konten & Validasi Berita
 * Menghasilkan data terstruktur sesuai kaidah jurnalistik cek fakta:
 * 1. Validasi / Verdict
 * 2. Narasi
 * 3. Penjelasan (Investigasi)
 * 4. Kesimpulan
 */
export function simulateNewsValidation(query: string): VerificationResult {
  const cleanQuery = query.trim().replace(/^["']|["']$/g, "");
  const lower = cleanQuery.toLowerCase();
  const timestamp = new Date().toISOString();

  const mockHash = "0x7f83b1a89c2d4e6f1a3b5c7d9e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b6d9069";
  const mockIpfs = "QmZtmD2qJ9wXk8L5vP3mR7tY1uN4bE6c8d0e2f3h89AB";
  const mockTx = "0xa8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e234567";

  // Kasus 1: Terindikasi Hoaks / Fabricated Content
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
      publisher: "Media Sosial & Saluran Pesan Daring",
      publishedDate: new Date(Date.now() - 3600000 * 3).toISOString(),
      articleHash: mockHash,
      credibilityScore: 18,
      status: "HOAX",
      summary: "Isu ini merupakan klaim fabrikasi yang tidak memiliki basis data faktual. Hasil penelusuran arsip regulasi dan konfirmasi lintas instansi menyatakan bahwa informasi yang beredar adalah manipulatif dan keliru.",
      narrative: `Akun media sosial dan pesan berantai mengunggah potongan narasi klaim yang menyebutkan: "${cleanQuery}". Unggahan ini beredar luas melalui tangkapan layar tanpa menyertakan dokumen rujukan, nomor keputusan resmi, maupun tautan siaran pers yang valid.`,
      explanation: `Tim Pemeriksa Fakta konsorsium jurnalisme menelusuri kebenaran klaim dengan memeriksa basis data regulasi pemerintah, konfirmasi langsung ke kementerian/lembaga terkait, dan penelusuran arsip siaran pers resmi. Hasil penelusuran menunjukkan bahwa tidak ada keputusan, siaran pers, maupun kebijakan pemerintah yang membenarkan klaim tersebut. Narasi yang beredar merupakan hasil fabrikasi disinformasi yang disebarkan berulang kali untuk memicu keresahan publik.`,
      conclusion: `Faktanya, informasi mengenai "${cleanQuery}" adalah INFORMASI PALSU (FABRICATED CONTENT / HOAKS). Instansi kementerian terkait tidak pernah mengeluarkan kebijakan maupun rilis seperti yang diklaim. Masyarakat disarankan mengabaikan narasi ini dan merujuk kanal informasi resmi pemerintah.`,
      keyFindings: [
        "Status Verifikasi: Terkonfirmasi sebagai klaim bohong hasil rekayasa tanpa rujukan resmi.",
        "Klarifikasi Instansi: Kementerian berwenang tidak pernah mengeluarkan pernyataan atau kebijakan terkait.",
        "Himbauan: Hentikan peredaran pesan berantai dan laporkan konten ke kanal cek fakta resmi.",
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

  // Kasus 2: Terverifikasi Benar / Valid
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
      narrative: `Beredar pemberitaan di media massa dan kanal komunikasi publik mengenai: "${cleanQuery}". Publik mencari kepastian faktual mengenai keabsahan informasi dan keaslian dokumen kebijakan yang diberitakan.`,
      explanation: `Tim verifikasi melakukan konfirmasi silang terhadap dokumen lembaran negara, siaran pers kementerian berwenang, dan publikasi kantor berita terverifikasi Dewan Pers. Hasil audit integritas data menunjukkan bahwa informasi ini akurat, berbasis data resmi, dan didukung oleh rekaman pernyataan langsung para pemangku kebijakan publik yang berwenang.`,
      conclusion: `Faktanya, pemberitaan mengenai "${cleanQuery}" adalah FAKTA VALID (TERKONFIRMASI). Informasi ini akurat, selaras dengan dokumen keputusan kementerian, dan dapat dijadikan rujukan resmi informasi publik.`,
      keyFindings: [
        "Status Verifikasi: Memenuhi standar integritas jurnalistik dan rilis resmi kementerian.",
        "Konteks Faktual: Angka, kutipan narasumber, dan kronologi bersesuaian dengan siaran pers pemerintah.",
        "Integritas Publikasi: Laporan terverifikasi Dewan Pers dengan audit integritas on-chain.",
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

  // Kasus 3: Meragukan / Konten Menyesatkan (Misleading Content - Sesuai Lampiran Pengguna)
  return {
    url: cleanQuery.startsWith("http") ? cleanQuery : "",
    title: cleanQuery.startsWith("http") ? cleanQuery : (cleanQuery || "Harga nasi naik 200%"),
    publisher: "Akun Media Sosial & Media Daring Publik",
    publishedDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    articleHash: mockHash,
    credibilityScore: 62,
    status: "QUESTIONABLE",
    summary: "Isu ini memiliki sebagian dasar fakta, namun narasi yang beredar memuat generalisasi keliru atau menggunakan rekaman/wacana di luar konteks aslinya sehingga menyesatkan publik.",
    narrative: `Akun media sosial mengunggah potongan video dan tangkapan layar dengan narasi: "${cleanQuery}". Unggahan ini disertai klaim yang mengaitkan pernyataan pejabat/lembaga dengan isu yang sedang ramai diperbincangkan saat ini, namun tanpa mencantumkan tanggal asli peristiwa maupun konteks utuh pembahasan.`,
    explanation: `Tim Pemeriksa Fakta konsorsium menelusuri kebenaran klaim dengan memasukkan tangkapan layar video ke Google Lens / Reverse Video Search. Hasilnya, ditemukan bahwa rekaman yang digunakan merupakan arsip dokumentasi peristiwa terdahulu atau wacana teknis yang belum diputuskan secara final. Narator di media sosial memotong durasi dan menambahkan teks opini yang membelokkan substansi pembicaraan dari konteks sebenarnya.`,
    conclusion: `Faktanya, unggahan dengan klaim "${cleanQuery}" merupakan KONTEN YANG MENYESATKAN (MISLEADING CONTENT). Rekaman dan narasinya telah dipelintir dari konteks aslinya sehingga menggiring opini publik yang keliru.`,
    keyFindings: [
      "Status Verifikasi: Terdeteksi sebagai konten berpotensi viral dengan konteks yang dipelintir.",
      "Konteks Faktual: Dokumen atau video asli berasal dari arsip pembahasan sebelumnya, bukan peristiwa baru.",
      "Himbauan: Waspadai video out-of-context. Periksa tanggal publikasi dan konteks utuh pidato/rilis.",
    ],
    claimsReview: [
      {
        claim: cleanQuery || "Harga nasi naik 200%",
        claimant: "Unggahan Media Sosial & Tangkapan Layar",
        claimDate: new Date().toISOString().split("T")[0],
        reviewPublisher: "Tempo Cek Fakta / MAFINDO",
        reviewUrl: "https://cekfakta.tempo.co",
        rating: "Sebagian Benar / Konten Menyesatkan",
      },
    ],
    ipfsCid: mockIpfs,
    txHash: mockTx,
    network: "Base Sepolia (Layer-2)",
    timestamp,
  };
}
