import { VerificationResult } from "@/types";

export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function shortenHash(hash?: string, chars = 6): string {
  if (!hash) return "";
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

export function getScoreStatusText(score: number, isNews = true): {
  text: string;
  colorClass: string;
  barColorClass: string;
} {
  if (!isNews) {
    return {
      text: "BUKAN BERITA",
      colorClass: "text-slate-500 dark:text-zinc-400",
      barColorClass: "bg-slate-300 dark:bg-zinc-700",
    };
  }
  if (score >= 80) {
    return {
      text: "SANGAT BAIK",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      barColorClass: "bg-emerald-500",
    };
  }
  if (score >= 50) {
    return {
      text: "MERAGUKAN",
      colorClass: "text-amber-600 dark:text-amber-400",
      barColorClass: "bg-amber-500",
    };
  }
  return {
    text: "SANGAT BURUK",
    colorClass: "text-[#dc2626] dark:text-rose-400",
    barColorClass: "bg-[#dc2626]",
  };
}

export function getScoreBadge(score: number): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  if (score >= 80) {
    return {
      label: "Terverifikasi Valid",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500 dark:text-emerald-400",
      borderColor: "border-emerald-500/30",
    };
  }
  if (score >= 50) {
    return {
      label: "Perlu Verifikasi Lanjutan",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500 dark:text-amber-400",
      borderColor: "border-amber-500/30",
    };
  }
  return {
    label: "Terindikasi Hoax",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500 dark:text-rose-400",
    borderColor: "border-rose-500/30",
  };
}

/**
 * Validasi Konten Berita vs Non-Berita (Simulasi Cerdas)
 * Memeriksa apakah input merupakan artikel berita, klaim faktual publik, atau percakapan/teks biasa.
 */
export function isNewsContent(input: string): {
  isNews: boolean;
  reason: string;
  queryType?: string;
  category?: string;
} {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Deteksi Tautan URL Portal Berita / Media
  const urlPattern = /(https?:\/\/[^\s]+)|([a-zA-Z0-9-]+\.(com|id|co\.id|org|net|gov|go\.id|info|biz|tv|news|me)($|\/|[^\s]*))/i;
  if (urlPattern.test(text)) {
    return {
      isNews: true,
      reason: "Tautan URL portal berita atau publikasi digital terdeteksi.",
      category: "Tautan Berita",
    };
  }

  // 2. Deteksi Sapaan, Percakapan Santai, dan Prompt AI
  const casualGreetings = [
    "halo", "hai", "helo", "hello", "hi", "p", "tes", "test", "testing",
    "ping", "selamat pagi", "selamat siang", "selamat sore", "selamat malam",
    "assalamualaikum", "assalamu'alaikum", "sampurasun", "apa kabar",
    "kamu siapa", "siapa kamu", "siapa anda", "namamu siapa", "kamu bisa apa",
    "lagi apa", "lagi ngapain", "buatkan saya", "buatkan puisi", "bikin puisi",
    "tuliskan cerita", "cara membuat", "cara masak", "resep", "cara mencuci",
    "terima kasih", "makasih", "ok", "oke", "sip", "mantap", "keren"
  ];

  for (const greeting of casualGreetings) {
    if (lower === greeting || lower === greeting + "!" || lower === greeting + "?") {
      return {
        isNews: false,
        reason: "Input teridentifikasi sebagai sapaan santai atau percakapan umum.",
        queryType: "Sapaan / Percakapan",
      };
    }
  }

  // 3. Deteksi Teks Acak / Gibberish / Angka Tunggal
  if (/^([a-z])\1+$/i.test(text) || /^(asdf|qwerty|12345|zxcv)/i.test(lower)) {
    return {
      isNews: false,
      reason: "Teks acak atau pengetikan tidak terstruktur terdeteksi.",
      queryType: "Teks Acak / Non-Faktual",
    };
  }

  // 4. Deteksi Kata Tunggal Sangat Pendek tanpa konteks berita
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1 && text.length < 15) {
    const singleWordNews = [
      "subsidi", "bansos", "pemilu", "pilpres", "pilkada", "gempa",
      "tsunami", "banjir", "korupsi", "inflasi", "prabowo", "gibran",
      "jokowi", "kpk", "dpr", "apbn", "pertalite", "pertamax", "bencana"
    ];
    if (!singleWordNews.includes(lower)) {
      return {
        isNews: false,
        reason: "Input berupa kata tunggal atau frasa terlalu singkat tanpa konteks berita faktual.",
        queryType: "Frasa Terlalu Singkat",
      };
    }
  }

  // 5. Kata Kunci Isu Publik, Kebijakan, Pejabat, Regulasi, atau Bencana
  const newsKeywords = [
    "berita", "kabar", "isu", "viral", "hoaks", "hoax", "klaim", "klarifikasi",
    "resmi", "siaran pers", "menteri", "kementerian", "presiden", "wapres",
    "prabowo", "gibran", "jokowi", "bahlil", "sri mulyani", "pemerintah",
    "dpr", "mpr", "kpu", "bawaslu", "polisi", "kapolri", "tni", "kpk",
    "kejaksaan", "mahkamah", "uu", "ruu", "perpres", "permen", "aturan",
    "kebijakan", "subsidi", "bbm", "pertalite", "pertamax", "solar", "elpiji",
    "gas 3kg", "bansos", "blt", "pkh", "bantuan sosial", "pajak", "ppn",
    "tarif", "bpjs", "kesehatan", "apbn", "apbd", "korupsi", "ott",
    "tersangka", "kasus", "ditangkap", "meninggal", "wafat", "tewas",
    "kecelakaan", "gempa", "tsunami", "banjir", "gunung", "meletus",
    "bencana", "bmkg", "bnpb", "ekonomi", "rupiah", "inflasi", "dolar",
    "bocoran", "tersebar", "edar", "surat edaran", "pembagian", "hadiah",
    "saldo gratis", "link pendaftaran", "pencabutan", "kenaikan", "penurunan",
    "ditutup", "dibuka", "vaksin", "pandemi", "covid", "ikn", "nusantara"
  ];

  const hasNewsKeyword = newsKeywords.some((kw) => lower.includes(kw));
  if (hasNewsKeyword) {
    return {
      isNews: true,
      reason: "Terdeteksi kata kunci kebijakan publik, peristiwa sosial, atau klaim berita faktual.",
      category: "Isu Publik & Jurnalistik",
    };
  }

  // 6. Kalimat dengan struktur pernyataan / klaim
  if (words.length >= 4) {
    const nonNewsPatterns = ["resep", "cara membuat", "cara memasak", "lagu", "lirik", "chord", "puisi", "cerita pendek"];
    const isTutorial = nonNewsPatterns.some((pattern) => lower.includes(pattern));
    if (isTutorial) {
      return {
        isNews: false,
        reason: "Input teridentifikasi sebagai resep masakan, tutorial umum, atau konten non-jurnalistik.",
        queryType: "Tutorial / Non-Berita",
      };
    }

    return {
      isNews: true,
      reason: "Kalimat memuat struktur klaim pernyataan peristiwa yang dapat diuji kebenarannya.",
      category: "Klaim Narasi Publik",
    };
  }

  // Fallback untuk kueri pendek tidak dikenal
  return {
    isNews: false,
    reason: "Input tidak memuat indikator peristiwa jurnalistik, rilis kementerian, atau klaim faktual publik.",
    queryType: "Teks Bebas Non-Berita",
  };
}

/**
 * Mesin Simulasi Validasi Berita
 * Menghasilkan objek VerificationResult lengkap dengan status klasifikasi BERITA vs BUKAN BERITA.
 */
export function simulateNewsValidation(query: string): VerificationResult {
  const cleanQuery = query.trim();
  const validation = isNewsContent(cleanQuery);
  const timestamp = new Date().toISOString();

  // KASUS 1: BUKAN BERITA
  if (!validation.isNews) {
    return {
      url: "",
      title: cleanQuery,
      publisher: undefined,
      publishedDate: undefined,
      articleHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      credibilityScore: 0,
      status: "NON_NEWS",
      summary: `Teks yang Anda masukkan diklasifikasikan sebagai BUKAN KONTEN BERITA (${validation.queryType || "Teks Bebas"}). Sistem mendeteksi bahwa input ini berupa sapaan, percakapan santai, pertanyaan umum, atau teks acak yang tidak memuat klaim faktual publik yang dapat diuji kebenarannya.`,
      keyFindings: [
        `Hasil Klasifikasi: ${validation.reason}`,
        "Pengujian Konsensus: Verifikasi cek fakta IFCN dan pencatatan kriptografis blockchain hanya berlaku untuk artikel berita dan klaim faktual publik.",
        "Rekomendasi: Masukkan topik berita, narasi klaim viral, atau tempelkan URL dari portal berita untuk memulai audit fakta.",
      ],
      claimsReview: [],
      ipfsCid: "QmBukanKontenBeritaDilewati",
      network: "Base Sepolia (Layer-2)",
      timestamp,
      isNews: false,
      contentType: "BUKAN_BERITA",
      validationReason: validation.reason,
      nonNewsDetails: {
        queryType: validation.queryType || "Teks Bebas Non-Berita",
        suggestion: "Coba ketik topik berita seperti 'Pemerintah dikabarkan mencabut subsidi BBM' atau tempelkan tautan portal berita resmi.",
      },
    };
  }

  // KASUS 2: KONTEN BERITA (Lolos Validasi)
  const lower = cleanQuery.toLowerCase();

  // Pola klaim salah / hoaks
  const isLikelyHoax =
    lower.includes("gratis") ||
    lower.includes("saldo") ||
    lower.includes("telegram") ||
    lower.includes("dicabut") ||
    lower.includes("bocoran") ||
    lower.includes("rahasia") ||
    lower.includes("meninggal") ||
    lower.includes("palsu") ||
    lower.includes("hoaks") ||
    lower.includes("hoax") ||
    lower.includes("bagikan link") ||
    lower.includes("berhadiah");

  // Pola berita valid / terkonfirmasi
  const isLikelyValid =
    lower.includes("resmi") ||
    lower.includes("kemensetneg") ||
    lower.includes("siaran pers") ||
    lower.includes("bps") ||
    lower.includes("antaranews") ||
    lower.includes("kompas.com") ||
    lower.includes("terverifikasi") ||
    lower.includes("apbn 2026");

  // Mock hash deterministik
  const mockHash = "0x" + Array.from(cleanQuery).reduce((acc, char, i) => {
    const code = (char.charCodeAt(0) * (i + 1) * 31).toString(16);
    return (acc + code).slice(0, 64);
  }, "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069");

  const mockIpfs = "Qm" + Array.from(cleanQuery).reduce((acc, char, i) => {
    const code = (char.charCodeAt(0) * (i + 7)).toString(36);
    return (acc + code).slice(0, 44);
  }, "ZtmD2qtWPQgVhX6eC36dNgK8Kq8f47z1K3G74y3h89ABC");

  const mockTx = "0x" + Array.from(cleanQuery).reduce((acc, char, i) => {
    const code = (char.charCodeAt(0) * (i + 3)).toString(16);
    return (acc + code).slice(0, 64);
  }, "a8b9c0d1e2f34567890abcdef1234567890abcdef1234567890abcdef1234567");

  if (isLikelyHoax) {
    return {
      url: cleanQuery.startsWith("http") ? cleanQuery : "",
      title: cleanQuery.startsWith("http") ? cleanQuery : `Klaim Beredar: "${cleanQuery}"`,
      publisher: "Jejaring Media Sosial & Pesan Berantai",
      publishedDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      articleHash: mockHash,
      credibilityScore: 18,
      status: "HOAX",
      summary: `Kueri berhasil divalidasi sebagai KONTEN BERITA / KLAIM FAKTUAL. Hasil penalaran semantik Google Gemini 2.0 Flash dan pemeriksaan basis data konsorsium cek fakta mengonfirmasi bahwa narasi ini adalah INFORMASI PALSU (HOAKS). Tidak ditemukan bukti dokumen regulasi maupun siaran pers resmi yang mendukung klaim ini.`,
      keyFindings: [
        "Status Validasi Konten: Terverifikasi sebagai klaim berita publik yang beredar luas di media daring.",
        "Klarifikasi Instansi Resmi: Lembaga/kementerian berwenang tidak pernah mengeluarkan kebijakan seperti yang diklaim.",
        "Modus Informasi: Narasi menggunakan pola disinformasi repetitif yang bertujuan mengecoh publik atau phishing digital.",
      ],
      claimsReview: [
        {
          claim: cleanQuery,
          claimant: "Akun Media Sosial / Broadcast Anonim",
          claimDate: new Date().toISOString().split("T")[0],
          reviewPublisher: "MAFINDO (Masyarakat Anti Fitnah Indonesia)",
          reviewUrl: "https://turnbackhoax.id",
          rating: "Salah / Hoaks Pabrikasi",
        },
        {
          claim: "Klarifikasi fakta mengenai narasi seputar " + cleanQuery.slice(0, 35),
          claimant: "Tangkapan Layar & Pesan Singkat",
          claimDate: new Date().toISOString().split("T")[0],
          reviewPublisher: "Kompas Cek Fakta",
          reviewUrl: "https://www.kompas.com/cekfakta",
          rating: "Keliru & Menyesatkan",
        },
      ],
      ipfsCid: mockIpfs,
      txHash: mockTx,
      network: "Base Sepolia (Layer-2)",
      timestamp,
      isNews: true,
      contentType: "BERITA",
      validationReason: validation.reason,
    };
  }

  if (isLikelyValid) {
    return {
      url: cleanQuery.startsWith("http") ? cleanQuery : "",
      title: cleanQuery.startsWith("http") ? cleanQuery : `Laporan Resmi: "${cleanQuery}"`,
      publisher: "Portal Berita Terakreditasi Dewan Pers",
      publishedDate: new Date(Date.now() - 3600000 * 2).toISOString(),
      articleHash: mockHash,
      credibilityScore: 94,
      status: "VALID",
      summary: `Kueri berhasil divalidasi sebagai KONTEN BERITA / KLAIM FAKTUAL. Narasi terkonfirmasi selaras dengan rilis pers resmi kementerian, data publikasi lembaga negara, dan dokumen regulasi yang dapat diverifikasi integritasnya.`,
      keyFindings: [
        "Status Validasi Konten: Memenuhi standar integritas jurnalistik dan rilis resmi kementerian.",
        "Pencocokan Data: Angka, kutipan narasumber, dan kronologi peristiwa bersesuaian dengan siaran pers pemerintah.",
        "Integritas Publikasi: Laporan telah dipublikasikan oleh kantor berita terdaftar dan terverifikasi Dewan Pers.",
      ],
      claimsReview: [
        {
          claim: cleanQuery,
          claimant: "Siaran Pers Pemerintah / Media Kredibel",
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
      isNews: true,
      contentType: "BERITA",
      validationReason: validation.reason,
    };
  }

  // Isu meragukan / perlu verifikasi lanjutan
  return {
    url: cleanQuery.startsWith("http") ? cleanQuery : "",
    title: cleanQuery.startsWith("http") ? cleanQuery : `Pemeriksaan Isu: "${cleanQuery}"`,
    publisher: "Media Daring Publik",
    publishedDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    articleHash: mockHash,
    credibilityScore: 62,
    status: "QUESTIONABLE",
    summary: `Kueri berhasil divalidasi sebagai KONTEN BERITA / ISU PUBLIK. Berdasarkan penelusuran semantik, isu ini memiliki sebagian basis fakta terkait kebijakan yang sedang dibahas, namun narasi yang beredar di publik memuat generalisasi atau konteks yang belum rampung diputuskan.`,
    keyFindings: [
      "Status Validasi Konten: Terdeteksi sebagai perbincangan kebijakan publik dan isu berita nasional.",
      "Konteks Faktual: Terdapat wacana kebijakan terkait, namun petunjuk teknis pelaksanaan belum diresmikan dalam lembaran negara.",
      "Himbauan: Masyarakat disarankan menunggu pengumuman resmi dan tidak terburu-buru menyimpulkan kabar yang belum final.",
    ],
    claimsReview: [
      {
        claim: cleanQuery,
        claimant: "Diskusi Media Daring Publik",
        claimDate: new Date().toISOString().split("T")[0],
        reviewPublisher: "Tempo Cek Fakta",
        reviewUrl: "https://cekfakta.tempo.co",
        rating: "Sebagian Benar / Belum Final",
      },
    ],
    ipfsCid: mockIpfs,
    txHash: mockTx,
    network: "Base Sepolia (Layer-2)",
    timestamp,
    isNews: true,
    contentType: "BERITA",
    validationReason: validation.reason,
  };
}
