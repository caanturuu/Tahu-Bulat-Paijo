"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { ResultCard } from "@/components/ResultCard";
import { LoginModal } from "@/components/LoginModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FeatureDetailModal } from "@/components/FeatureDetailModal";
import { VerificationResult } from "@/types";
import {
  Plus,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  History,
  FileSearch,
  Cpu,
  Layers,
  Database,
  Users,
  Sparkles,
  Check,
  X,
  Globe,
  Zap,
  GitCompare,
  Lock,
  ChevronRight,
} from "lucide-react";

// 10 Curated Indonesian News Context Backgrounds
const INDONESIA_NEWS_BACKGROUNDS = [
  {
    src: "/news-bg/bg-1.jpg",
    alt: "Kepulauan Raja Ampat Papua",
    title: "Kedaulatan Maritim & Pariwisata Indonesia",
    tag: "Geopolitik & Kelautan",
  },
  {
    src: "/news-bg/bg-2.jpg",
    alt: "Skyline Jakarta & Bundaran HI",
    title: "Pusat Ekonomi, Bisnis & Finansial Nasional",
    tag: "Ekonomi & Pasar",
  },
  {
    src: "/news-bg/bg-3.jpg",
    alt: "Gunung Bromo & Wilayah Vulkanik",
    title: "Mitigasi Bencana & Kawasan Vulkanologi",
    tag: "Bencana & Lingkungan",
  },
  {
    src: "/news-bg/bg-4.jpg",
    alt: "Terasering Pertanian Nusantara",
    title: "Ketahanan Pangan & Kebijakan Agraria",
    tag: "Pangan & Pertanian",
  },
  {
    src: "/news-bg/bg-5.jpg",
    alt: "Monumen Nasional Monas Jakarta",
    title: "Pusat Kebijakan Politik & Pemerintahan RI",
    tag: "Politik Nasional",
  },
  {
    src: "/news-bg/bg-6.jpg",
    alt: "Redaksi Surat Kabar & Media Pers",
    title: "Verifikasi Jurnalisme & Media Massa",
    tag: "Cek Fakta Pers",
  },
  {
    src: "/news-bg/bg-7.jpg",
    alt: "Infrastruktur Transportasi Modern",
    title: "Konektivitas & Proyek Infrastruktur Publik",
    tag: "Infrastruktur",
  },
  {
    src: "/news-bg/bg-8.jpg",
    alt: "Konferensi Pers & Wawancara Pejabat",
    title: "Klarifikasi Pernyataan Resmi & Siaran Pers",
    tag: "Rilis Publik",
  },
  {
    src: "/news-bg/bg-9.jpg",
    alt: "Candi Borobudur Warisan Bangsa",
    title: "Warisan Sejarah, Budaya & Kebhinekaan",
    tag: "Sosial Budaya",
  },
  {
    src: "/news-bg/bg-10.jpg",
    alt: "Kawasan Pesisir & Garis Pantai Indonesia",
    title: "Kehidupan Nelayan & Sumber Daya Pesisir",
    tag: "Kemaritiman",
  },
];

// 6 Curated Hoax News Items matching reference design
const HOAX_NEWS_ITEMS = [
  {
    id: 1,
    image: "/hoax-news/hoax-1.jpg",
    title: "Manipulasi Berkas Ijazah & Dokumen Persidangan",
    tag: "[HOAX]",
    date: "08 Nov 2026",
    claim: "Klaim ijazah dan berkas persidangan palsu yang beredar luas di media sosial.",
  },
  {
    id: 2,
    image: "/hoax-news/hoax-2.jpg",
    title: "Titik Api Karhutla Sengaja Dibakar Secara Terkoordinasi",
    tag: "[HOAX]",
    date: "08 Nov 2026",
    claim: "Narasi bahwa kebakaran hutan sengaja disulut serentak oleh kelompok tertentu.",
  },
  {
    id: 3,
    image: "/hoax-news/hoax-3.jpg",
    title: "Rekaman Suara Instruksi Rahasia Bocor ke Publik",
    tag: "[HOAX]",
    date: "07 Nov 2026",
    claim: "Audio rekayasa kecerdasan buatan (deepfake audio) pejabat tinggi kementerian.",
  },
  {
    id: 4,
    image: "/hoax-news/hoax-4.jpg",
    title: "Formulir C1 Plano Tanda Tangan Ganda di TPS 04",
    tag: "[HOAX]",
    date: "07 Nov 2026",
    claim: "Foto manipulasi hasil scan lembar penghitungan suara pilkada serentak.",
  },
  {
    id: 5,
    image: "/hoax-news/hoax-5.jpg",
    title: "Rebusan Daun Pepaya Sembuhkan Diabetes 3 Hari",
    tag: "[HOAX]",
    date: "06 Nov 2026",
    claim: "Informasi kesehatan tanpa konfirmasi uji klinis dari Ikatan Dokter Indonesia.",
  },
  {
    id: 6,
    image: "/hoax-news/hoax-6.jpg",
    title: "Tautan Pendaftaran Bansos Tunai Kemensos Rp 5 Juta",
    tag: "[HOAX]",
    date: "06 Nov 2026",
    claim: "Situs tiruan (phising) yang meminta data KTP dan nomor rekening korban.",
  },
];

// Sidebar Trending Hoax Items
const POPULAR_HOAX_ITEMS = [
  {
    rank: 1,
    title: "Deepfake Audio Pidato Pejabat Terkait Kenaikan Pajak PPN 12%...",
    views: "54.2k dibaca",
    image: "/hoax-news/pop-1.jpg",
  },
  {
    rank: 2,
    title: "Tautan Pendaftaran Bansos Tunai BSU Rp 5.000.000 Lewat Bot...",
    views: "42.8k dibaca",
    image: "/hoax-news/pop-2.jpg",
  },
  {
    rank: 3,
    title: "Klaim Rekrutmen ASN Kemenkes Tanpa Tes untuk Tenaga Honorer...",
    views: "31.5k dibaca",
    image: "/hoax-news/hoax-3.jpg",
  },
];

// Mock verification results for demonstration
const SAMPLE_VERIFICATION_RESULT: VerificationResult = {
  url: "https://turnbackhoax.id/contoh-klaim-subsidi-energi",
  title: "Klaim Subsidi Energi Dicabut Total Mulai Akhir Bulan Ini",
  publisher: "TurnBackHoax.id (MAFINDO)",
  publishedDate: "2026-11-20T10:00:00Z",
  articleHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  credibilityScore: 18,
  status: "HOAX",
  summary:
    "Klaim bahwa subsidi energi dicabut secara total telah dibantah oleh siaran pers resmi Kementerian ESDM dan Kementerian Keuangan. Narasi yang beredar di media sosial memotong pernyataan pejabat dan menyebarkan judul provokatif tanpa dasar data APBN sebenarnya.",
  keyFindings: [
    "Pemerintah tidak pernah mengeluarkan rilis pencabutan subsidi energi total per akhir bulan.",
    "Alokasi APBN 2026 membuktikan anggaran perlindungan subsidi energi masyarakat tetap aman.",
    "Penyebaran dilakukan oleh akun tidak terverifikasi dengan tangkapan layar hasil manipulasi.",
  ],
  claimsReview: [
    {
      claim: "Pemerintah mencabut subsidi energi secara total pada akhir bulan ini.",
      claimant: "Postingan Viral Media Sosial",
      claimDate: "2026-11-19",
      reviewPublisher: "MAFINDO (TurnBackHoax.id)",
      reviewUrl: "https://turnbackhoax.id",
      rating: "SALAH / FABRIKASI",
    },
    {
      claim: "Anggaran subsidi BBM dihapus dari APBN 2026.",
      claimant: "Akun Media Sosial Anonim",
      claimDate: "2026-11-18",
      reviewPublisher: "Cek Fakta Kompas.com",
      reviewUrl: "https://kompas.com/cekfakta",
      rating: "MISLEADING / MENYESATKAN",
    },
  ],
  ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  txHash: "0x4a9b8f3d12c8a7e4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
  network: "Base Sepolia (Layer-2)",
  timestamp: "2026-11-21T04:30:00Z",
  hasRevisions: false,
};

// Sample verification result with silent revision diff demonstration
const SAMPLE_DIFF_VERIFICATION_RESULT: VerificationResult = {
  url: "https://media-daring.id/berita/penyesuaian-tarif-energi-2026",
  title: "Pemerintah Lakukan Penataan Skema Penyaluran Subsidi Energi",
  publisher: "Media Harian Nusantara",
  publishedDate: "2026-11-21T08:15:00Z",
  articleHash: "7b4c9e12f0a8d3e5b6c7a8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
  credibilityScore: 78,
  status: "QUESTIONABLE",
  summary:
    "Terdeteksi perubahan redaksi diam-diam (silent edit) 3 jam setelah rilis awal. Judul awal mengklaim pencabutan subsidi secara sepihak, kemudian diubah menjadi penataan skema penyaluran tanpa catatan ralat resmi dari tim redaksi.",
  keyFindings: [
    "Versi awal (08:00 WIB) memuat klaim sepihak: 'Subsidi BBM dan listrik dipastikan dicabut akhir bulan.'",
    "Versi revisi (11:30 WIB) disunting menjadi: 'Penyaluran subsidi energi dialihkan ke skema bantuan tunai tepat sasaran.'",
    "Tidak ditemukan ralat atau disclaimer catatan redaksi terkait perbaikan isi berita tersebut.",
  ],
  claimsReview: [
    {
      claim: "Klaim awal menyebutkan pencabutan subsidi BBM tanpa skema bantuan pengganti.",
      claimant: "Redaksi Media Daring",
      claimDate: "2026-11-21",
      reviewPublisher: "VeritasChain Diff Engine v2",
      reviewUrl: "#",
      rating: "DIREVISI DIAM-DIAM",
    },
  ],
  ipfsCid: "QmZ1DiffTracker99xAzLqWeb3VeritasChainCID77",
  txHash: "0x8f2d6c1e3a4b5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
  network: "Base Sepolia (Layer-2)",
  timestamp: "2026-11-21T11:45:00Z",
  hasRevisions: true,
  diffSummary: {
    addedWords: 14,
    removedWords: 11,
    diffHtml:
      'Pemerintah mengumumkan kebijakan baru terkait <span class="bg-rose-100 text-rose-800 line-through dark:bg-rose-950/70 dark:text-rose-300">pencabutan subsidi BBM secara sepihak</span> <span class="bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-950/70 dark:text-emerald-300">penataan skema bantuan energi agar lebih tepat sasaran</span> bagi masyarakat berpenghasilan rendah. Berdasarkan data Kemenkeu, alokasi anggaran <span class="bg-rose-100 text-rose-800 line-through dark:bg-rose-950/70 dark:text-rose-300">dihapus total</span> <span class="bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-950/70 dark:text-emerald-300">dialihkan menjadi subsidi tunai langsung (BLT)</span>.',
  },
};

// Audit History sample records
const AUDIT_HISTORY = [
  {
    id: "tx-001",
    title: "Penyesuaian Skema Penyaluran Subsidi Energi Tepat Sasaran",
    score: 84,
    status: "VALID",
    hash: "0x8f2d...3a1c",
    ipfsCid: "QmXo...6uco",
    date: "21 Nov 2026 10:20",
    tx: "0x4a9b...f7a8",
  },
  {
    id: "tx-002",
    title: "Klaim Subsidi Energi Dicabut Total Mulai Akhir Bulan Ini",
    score: 18,
    status: "HOAX",
    hash: "0xe3b0...b855",
    ipfsCid: "QmYp...9xaz",
    date: "20 Nov 2026 15:45",
    tx: "0x9c1d...3e2a",
  },
  {
    id: "tx-003",
    title: "Rilis Resmi Hasil Evaluasi BKN Terkait Pendaftaran Formasi Teknis",
    score: 92,
    status: "VALID",
    hash: "0x5d4e...11bb",
    ipfsCid: "QmZ1...44tt",
    date: "19 Nov 2026 09:12",
    tx: "0x11cc...aa99",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState("Cek Fakta");

  // Rotating background state (15 seconds rotation)
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedFeatureModal, setSelectedFeatureModal] = useState<"konsorsium" | "blockchain" | "diff" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Hidden file input for plus button
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 15 seconds automatic rotation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % INDONESIA_NEWS_BACKGROUNDS.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Simulate verification AI pipeline (FastAPI + Gemini 2.0 Flash)
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult(SAMPLE_VERIFICATION_RESULT);

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById("verification-result-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuery(`[Unggahan Tangkapan Layar: ${file.name}] Menganalisis teks dan klaim berita...`);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setQuery(topic);
  };

  const handleCheckHoax = (title: string) => {
    setQuery(title);
    setActiveTab("Cek Fakta");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reusable Hoax News Section (matching uploaded reference)
  const renderHoaxNewsSection = () => (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-slate-900 dark:text-white tracking-tight">
          Berita Hoax Terkini
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Kumpulan kabar keliru yang viral di media sosial, lengkap dengan penelusuran fakta dan bukti aslinya.
        </p>
      </div>

      {/* Main Grid: 8 Cols Cards + 4 Cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6 Hoax Cards */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {HOAX_NEWS_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-[22px] border border-slate-200/90 bg-white p-3.5 shadow-xs hover:shadow-xl hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Tag */}
                  <div className="mt-3.5">
                    <span className="font-bold text-xs uppercase tracking-tight text-rose-600 dark:text-rose-400">
                      {item.tag}
                    </span>
                    <h3 className="mt-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#185adb] dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-zinc-800/80">
                  <span className="text-slate-400 dark:text-zinc-500 font-medium">
                    {item.date}
                  </span>
                  <button
                    onClick={() => handleCheckHoax(item.title)}
                    className="font-semibold text-[#185adb] dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Cek Fakta →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Berita Terpopuler Saat Ini */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Berita Terpopuler Saat Ini
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
              5 klaim berita & isu hoaks yang paling banyak dibaca dan diuji kebenarannya hari ini.
            </p>

            <div className="space-y-4">
              {POPULAR_HOAX_ITEMS.map((pop) => (
                <div key={pop.rank} className="flex items-center gap-3.5 group">
                  <span className="text-xl font-extrabold text-[#185adb] dark:text-blue-400 w-5 shrink-0">
                    {pop.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => handleCheckHoax(pop.title)}
                      className="font-bold text-xs text-slate-800 dark:text-zinc-200 line-clamp-2 leading-snug cursor-pointer group-hover:text-[#185adb] dark:group-hover:text-blue-400 transition-colors"
                    >
                      {pop.title}
                    </h4>
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                      {pop.views} •{" "}
                      <span
                        onClick={() => handleCheckHoax(pop.title)}
                        className="font-semibold text-[#185adb] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Cek Fakta →
                      </span>
                    </p>
                  </div>
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 shadow-2xs">
                    <Image
                      src={pop.image}
                      alt={pop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Kampanye Literasi Informasi Digital (Poster Resmi - Proporsional) */}
          <div className="flex justify-center w-full pt-1">
            <div className="relative overflow-hidden rounded-3xl w-full max-w-[270px] shadow-sm hover:shadow-md transition-all">
              <Image
                src="/hoax-news/anti-hoax-poster.jpg"
                alt="Kampanye Literasi Informasi Digital - STOP HOAX! Saring Sebelum Sharing"
                width={270}
                height={400}
                className="w-full h-auto object-contain rounded-3xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {/* Hidden file input for OCR screenshot upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserEmail("");
        }}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoggedIn(true);
          setUserEmail("validator@veritaschain.id");
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Feature Deep Dive Interactive Modal */}
      <FeatureDetailModal
        isOpen={selectedFeatureModal !== null}
        onClose={() => setSelectedFeatureModal(null)}
        type={selectedFeatureModal}
        onSelectSampleQuery={(sampleQuery) => {
          setQuery(sampleQuery);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onLoadDiffDemo={() => {
          setResult(SAMPLE_DIFF_VERIFICATION_RESULT);
          setTimeout(() => {
            const el = document.getElementById("verification-result-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }}
      />

      {/* ================= TAB 1: CEK FAKTA (DEFAULT) ================= */}
      {activeTab === "Cek Fakta" && (
        <>
          {/* Hero Section with 10 Rotating Indonesian News Backgrounds (Every 15s) */}
          <section className="relative w-full overflow-hidden bg-slate-900 min-h-[480px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center">
            {/* 10 Layered Rotating Background Images with Smooth Crossfade */}
            <div className="absolute inset-0 z-0">
              {INDONESIA_NEWS_BACKGROUNDS.map((bg, idx) => (
                <div
                  key={bg.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentBgIndex ? "opacity-90 z-1" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={bg.src}
                    alt={bg.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center brightness-105"
                  />
                </div>
              ))}

              {/* Top soft contrast overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-contrast-[1.05] z-2" />

              {/* Bottom gradient fade into page body */}
              <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-zinc-950 dark:via-zinc-950/85 z-2" />
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-3 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 text-center">
              {/* Serif Headline (Fully Responsive across Phone & PC) */}
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#1e293b] leading-[1.25] tracking-tight drop-shadow-xs dark:text-white px-2">
                Berita apa yang ingin
                <br />
                Anda periksa hari ini?
              </h1>

              {/* Floating Pill Search Bar */}
              <div className="mt-6 sm:mt-10 mx-auto w-full max-w-2xl px-1 sm:px-0">
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center rounded-full bg-white p-1.5 sm:p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/90 transition-all hover:shadow-[0_16px_50px_rgba(0,0,0,0.16)] dark:bg-zinc-900 dark:border-zinc-800"
                >
                  {/* Plus Button for screenshot upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    title="Unggah tangkapan layar berita"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tempel tautan berita, unggah tangkapan layar, atau ketik informasi..."
                    className="w-full bg-transparent px-2 sm:px-3 text-xs sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
                  />

                  {/* Blue Arrow Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#185adb] text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all shrink-0 disabled:opacity-70"
                    title="Periksa Sekarang"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </form>

                {/* Quick Topic Chips */}
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                  <span className="text-slate-600 dark:text-zinc-400 font-medium hidden sm:inline">
                    Contoh topik:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTopic(
                        "Klaim pencabutan subsidi BBM dan tarif listrik 2026"
                      )
                    }
                    className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-blue-600 active:scale-95 transition-all shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    Subsidi BBM Dicabut
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTopic(
                        "Rekayasa suara AI pejabat publik di WhatsApp"
                      )
                    }
                    className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-blue-600 active:scale-95 transition-all shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    Deepfake Suara Pejabat
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTopic(
                        "https://kompas.com/cekfakta/contoh-berita-valid"
                      )
                    }
                    className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 text-slate-700 border border-slate-200/80 hover:bg-white hover:text-blue-600 active:scale-95 transition-all shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    URL Berita Valid
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Verification Result Display */}
          {result && (
            <section id="verification-result-section" className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-10">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 dark:text-white">
                  <FileSearch className="h-5 w-5 text-[#185adb] dark:text-blue-400" />
                  Hasil Pemeriksaan Fakta & Audit Blockchain
                </h2>
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Tutup Hasil
                </button>
              </div>
              <ResultCard data={result} />
            </section>
          )}
        </>
      )}

      {/* ================= TAB 2: BERITA HOAKS ================= */}
      {activeTab === "Berita Hoaks" && renderHoaxNewsSection()}

      {/* ================= TAB 3: RIWAYAT AUDIT ================= */}
      {activeTab === "Riwayat" && (
        <section className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-200">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="h-6 w-6 text-[#185adb] dark:text-blue-400" />
                Riwayat Audit On-Chain (Base Sepolia)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Catatan bukti verifikasi berita yang tersimpan abadi di ledger blockchain.
              </p>
            </div>
            <a
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold dark:text-blue-400 hover:underline"
            >
              Buka BaseScan Explorer <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  <tr>
                    <th className="p-3.5 sm:p-4">Judul Artikel</th>
                    <th className="p-3.5 sm:p-4">Skor AI</th>
                    <th className="p-3.5 sm:p-4">Status</th>
                    <th className="p-3.5 sm:p-4 hidden sm:table-cell">Article Hash</th>
                    <th className="p-3.5 sm:p-4">Waktu Audit</th>
                    <th className="p-3.5 sm:p-4">Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-zinc-800 dark:text-zinc-300">
                  {AUDIT_HISTORY.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {row.title}
                      </td>
                      <td className="p-3.5 sm:p-4 font-bold font-mono">
                        {row.score}/100
                      </td>
                      <td className="p-3.5 sm:p-4">
                        {row.status === "VALID" ? (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs"
                            title="Valid"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 shadow-xs"
                            title="Hoaks"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 sm:p-4 font-mono text-[11px] text-slate-500 hidden sm:table-cell">
                        {row.hash}
                      </td>
                      <td className="p-3.5 sm:p-4 text-[11px] text-slate-500 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="p-3.5 sm:p-4">
                        <a
                          href={`https://sepolia.basescan.org/tx/${row.tx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#185adb] dark:text-blue-400 hover:underline"
                        >
                          {row.tx}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 4: TENTANG ================= */}
      {activeTab === "Tentang" && (
        <section className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-200 space-y-10">
          {/* Mission */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#185adb] mb-4 dark:bg-blue-950/40 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>HackSphere 2026 National Competition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tentang VeritasChain
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
              <strong>VeritasChain</strong> adalah platform verifikasi kebenaran berita terdesentralisasi yang menggabungkan kecerdasan buatan (*AI Reasoning*) dengan audit trail blockchain. Masalah utama yang kami selesaikan adalah maraknya penyebaran hoaks di Indonesia serta praktik manipulasi/revisi artikel berita secara diam-diam oleh media tanpa meninggalkan jejak redaksi yang transparan.
            </p>

            {/* Architecture Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <Cpu className="h-6 w-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Google Gemini 2.0 Flash</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Mengekstraksi klaim inti berita dan melakukan penalaran semantik terhadap basis data ClaimReview secara real-time.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <Layers className="h-6 w-6 text-[#185adb] mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Base Sepolia L2</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Finalitas transaksi 1-2 detik dan biaya gas bebas (*gasless relayer*) menggunakan standar EIP-712.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <Database className="h-6 w-6 text-amber-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">IPFS (Pinata Cloud)</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Penyimpanan snapshot teks berita asli dan laporan verifikasi secara permanen tanpa risiko sensor.
                </p>
              </div>
            </div>
          </div>

          {/* Team Profile */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Users className="h-4 w-4 text-[#185adb]" />
              <span>Tim Pengembang</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Tahu Bulat PAIJO — Astra Polytechnic
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Muhammad Ghassaan Al Faritsi</p>
                <p className="text-[11px] text-slate-500">Team Leader</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Juan Gunawan</p>
                <p className="text-[11px] text-slate-500">Member 1</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Muhammad Faishal Fatih</p>
                <p className="text-[11px] text-slate-500">Member 2</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-slate-50/70 py-8 text-center text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-zinc-300">
            VeritasChain © 2026
          </p>
          <p>
            Proyek Pengembangan Tim <strong>Tahu Bulat PAIJO</strong> — Astra Polytechnic untuk HackSphere 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
