"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ResultCard } from "@/components/ResultCard";
import { LoginModal } from "@/components/LoginModal";
import { FeatureDetailModal } from "@/components/FeatureDetailModal";
import { VerificationResult } from "@/types";
import { formatDate, shortenHash } from "@/lib/utils";
import {
  Search,
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

// 10 Curated Indonesian Viral News Backgrounds
const INDONESIA_NEWS_BACKGROUNDS = [
  {
    src: "/news-bg/viral-1.jpg",
    alt: "Aksi Unjuk Rasa Mahasiswa di Depan Gedung DPR RI Senayan",
    title: "Aksi Mahasiswa & Kawal Aspirasi Publik di DPR RI",
    tag: "Demokrasi & Aspirasi",
  },
  {
    src: "/news-bg/viral-2.jpg",
    alt: "Sidang Paripurna Kabinet Merah Putih di Istana Merdeka Jakarta",
    title: "Sidang Paripurna Kabinet & Arah Kebijakan Pemerintahan",
    tag: "Politik & Kabinet",
  },
  {
    src: "/news-bg/viral-3.jpg",
    alt: "Pengungkapan Sindikat Judi Online & Cyber Crime Komdigi oleh Polri",
    title: "Operasi Satgas Siber & Pemberantasan Judi Online",
    tag: "Hukum & Siber",
  },
  {
    src: "/news-bg/viral-4.jpg",
    alt: "Antrean Warga Pembelian Beras Murah SPHP Bulog di Pasar Tradisional",
    title: "Distribusi Beras SPHP Bulog & Stabilitas Pangan Pokok",
    tag: "Pangan & Ekonomi",
  },
  {
    src: "/news-bg/viral-5.jpg",
    alt: "Ruang Sidang Kasus Tipikor Komoditas Strategis di PN Jakarta Pusat",
    title: "Sidang Tipikor Kasus Korupsi Komoditas Strategis",
    tag: "Pemberantasan Korupsi",
  },
  {
    src: "/news-bg/viral-6.jpg",
    alt: "Erupsi Gunung Lewotobi Laki-Laki & Evakuasi Pengungsi di NTT",
    title: "Tanggap Darurat Erupsi Vulkanik Gunung Lewotobi NTT",
    tag: "Bencana Vulkanik",
  },
  {
    src: "/news-bg/viral-7.jpg",
    alt: "Kereta Cepat Whoosh Melaju Cepat di Jalur Layang Jawa Barat",
    title: "Operasional Kereta Cepat Whoosh & Konektivitas Modern",
    tag: "Infrastruktur",
  },
  {
    src: "/news-bg/viral-8.jpg",
    alt: "Kemegahan Istana Garuda Ibu Kota Nusantara (IKN) Kalimantan Timur",
    title: "Progres Pembangunan Kawasan Istana Garuda IKN",
    tag: "Ibu Kota Nusantara",
  },
  {
    src: "/news-bg/viral-9.jpg",
    alt: "Patroli KRI TNI AL & Kapal Bakamla Mengawal Kedaulatan Laut Natuna",
    title: "Patroli Kedaulatan Wilayah Maritim Laut Natuna Utara",
    tag: "Kedaulatan Maritim",
  },
  {
    src: "/news-bg/viral-10.jpg",
    alt: "Konferensi Pers Konsorsium Cek Fakta Jurnalisme Nasional di Jakarta",
    title: "Konsorsium Cek Fakta & Verifikasi Isu Viral Hoaks",
    tag: "Cek Fakta & Media",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Cek Fakta");

  // Rotating background state (15 seconds rotation)
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedFeatureModal, setSelectedFeatureModal] = useState<"konsorsium" | "blockchain" | "diff" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Hoax news search & filter state
  const [hoaxSearchQuery, setHoaxSearchQuery] = useState("");
  const [selectedHoaxCategory, setSelectedHoaxCategory] = useState("Semua");
  const [currentHoaxPage, setCurrentHoaxPage] = useState(1);
  const HOAX_ITEMS_PER_PAGE = 15;

  // Live database states from Supabase via FastAPI backend
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const [liveHoaxArticles, setLiveHoaxArticles] = useState<any[]>([]);

  // Function to refresh audit history
  const fetchLiveHistory = () => {
    fetch("http://localhost:8000/api/history")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setLiveHistory(data);
      })
      .catch(() => {});
  };

  // Function to fetch hoax articles catalog
  const fetchLiveHoaxArticles = (cat?: string) => {
    const url =
      cat && cat !== "Semua"
        ? `http://localhost:8000/api/hoax-articles?category=${encodeURIComponent(cat)}`
        : "http://localhost:8000/api/hoax-articles";
    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setLiveHoaxArticles(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLiveHistory();
  }, []);

  useEffect(() => {
    fetchLiveHoaxArticles(selectedHoaxCategory);
  }, [selectedHoaxCategory]);

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
    setServerNotice(null);

    try {
      const res = await fetch("http://localhost:8000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (res.ok) {
        const liveData = await res.json();
        setResult(liveData);
        fetchLiveHistory();
      } else {
        setResult(null);
        setServerNotice(
          `Kueri diterima: "${query.trim()}". Backend merespons status ${res.status}. Hasil tidak dapat ditampilkan.`
        );
      }
    } catch {
      setResult(null);
      setServerNotice(
        `Kueri diterima: "${query.trim()}". Server backend FastAPI (http://localhost:8000) belum terhubung.`
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        const el = document.getElementById("verification-result-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

  // Hoax News Section Rendering
  const renderHoaxNewsSection = () => {
    const q = hoaxSearchQuery.toLowerCase().trim();
    const filteredHoaxNews = liveHoaxArticles.filter((item) => {
      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.narasi?.toLowerCase().includes(q);

      const matchesCat =
        selectedHoaxCategory === "Semua" ||
        item.category?.toLowerCase().includes(selectedHoaxCategory.toLowerCase());

      return matchesQuery && matchesCat;
    });

    const totalPages = Math.ceil(filteredHoaxNews.length / HOAX_ITEMS_PER_PAGE);
    const paginatedHoaxNews = filteredHoaxNews.slice(
      (currentHoaxPage - 1) * HOAX_ITEMS_PER_PAGE,
      currentHoaxPage * HOAX_ITEMS_PER_PAGE
    );

    // Compute popular items if views_count is available
    const popularItems = [...liveHoaxArticles]
      .filter((a) => (a.views_count ?? 0) > 0)
      .sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0))
      .slice(0, 3);

    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Berita Hoax Terkini
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Katalog verifikasi kabar hoaks dan disinformasi publik yang telah dibantah oleh instansi resmi & konsorsium cek fakta.
            </p>
          </div>

          {/* Search Bar & Category Filter */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-9 w-9 items-center justify-center text-slate-400 dark:text-zinc-500 shrink-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <input
                  type="text"
                  value={hoaxSearchQuery}
                  onChange={(e) => {
                    setHoaxSearchQuery(e.target.value);
                    setCurrentHoaxPage(1);
                  }}
                  placeholder="Cari arsip berita hoaks, topik, atau kata kunci..."
                  className="w-full bg-transparent px-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                {hoaxSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHoaxSearchQuery("");
                      setCurrentHoaxPage(1);
                    }}
                    className="mr-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#185adb] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all shrink-0"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
                <span>Cari</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mr-1 shrink-0">
                Kategori:
              </span>
              {["Semua", "Politik", "Kesehatan", "Finansial", "Sosial", "Teknologi"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedHoaxCategory(cat);
                    setCurrentHoaxPage(1);
                  }}
                  className={`rounded-full px-3 py-1 font-medium transition-colors shrink-0 text-xs ${
                    selectedHoaxCategory === cat
                      ? "bg-[#185adb] text-white shadow-2xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={popularItems.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            {filteredHoaxNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 sm:py-28 px-4 text-center rounded-3xl border border-slate-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 dark:bg-zinc-800/80 dark:border-zinc-700/60 text-slate-400 dark:text-zinc-500 mb-4 shadow-2xs">
                  <FileSearch className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-zinc-100">
                  Belum Ada Berita Hoaks Terdata
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm">
                  {hoaxSearchQuery
                    ? `Tidak ada hasil untuk pencarian "${hoaxSearchQuery}".`
                    : "Daftar laporan kabar keliru yang viral akan otomatis ditampilkan saat data tersedia dari database."}
                </p>
                {hoaxSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHoaxSearchQuery("");
                      setSelectedHoaxCategory("Semua");
                      setCurrentHoaxPage(1);
                    }}
                    className="mt-4 text-xs font-semibold text-[#185adb] hover:underline"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {paginatedHoaxNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita-hoax/${item.id}`}
                    className="group flex flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-[#185adb] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 transition-all duration-200"
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <FileSearch className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                        )}
                      </div>

                      {/* Title & Tag */}
                      <div className="mt-3.5 space-y-1.5">
                        <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 rounded px-2 py-0.5 dark:bg-rose-950/40 dark:border-rose-900/40 dark:text-rose-400 font-bold">
                          {item.category || "HOAKS"}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#185adb] transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-zinc-800/80">
                      <span className="text-slate-500 dark:text-zinc-400 font-medium">
                        {item.published_date ? formatDate(item.published_date) : formatDate(item.created_at)}
                      </span>
                      <span className="font-bold text-[#185adb] dark:text-blue-400 flex items-center gap-0.5 group-hover:underline">
                        Cek Berita →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination bar */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-2xs">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Menampilkan{" "}
                  <strong className="text-slate-800 dark:text-zinc-200">
                    {(currentHoaxPage - 1) * HOAX_ITEMS_PER_PAGE + 1} -{" "}
                    {Math.min(currentHoaxPage * HOAX_ITEMS_PER_PAGE, filteredHoaxNews.length)}
                  </strong>{" "}
                  dari <strong>{filteredHoaxNews.length}</strong> berita
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentHoaxPage((p) => Math.max(1, p - 1))}
                    disabled={currentHoaxPage === 1}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-300"
                  >
                    ← Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentHoaxPage(pg)}
                      className={`rounded-lg px-3 py-1.5 font-bold shadow-xs ${
                        currentHoaxPage === pg
                          ? "bg-[#185adb] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentHoaxPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentHoaxPage === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-300"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Berita Terpopuler (Hanya tampil jika ada data popular) */}
          {popularItems.length > 0 && (
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#185adb]" />
                  Berita Terpopuler Saat Ini
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
                  Isu hoaks yang paling banyak dibaca dan diakses klarifikasinya oleh publik.
                </p>

                <div className="space-y-4">
                  {popularItems.map((pop, idx) => (
                    <Link
                      key={pop.id}
                      href={`/berita-hoax/${pop.id}`}
                      className="group flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 p-2 rounded-xl transition-colors"
                    >
                      <span className="text-xl font-extrabold text-[#185adb] w-5 shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-slate-800 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-[#185adb] transition-colors">
                          {pop.title}
                        </h4>
                        <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                          {pop.views_count} kali dibaca
                        </p>
                      </div>
                      {pop.image_url && (
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800">
                          <img
                            src={pop.image_url}
                            alt={pop.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 selection:bg-blue-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-50 antialiased flex flex-col justify-between">
      {/* 1. Header & Navigation Bar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 pb-16">
        {/* ================= TAB 1: CEK FAKTA KILAT ================= */}
        {activeTab === "Cek Fakta" && (
          <>
            {/* Hero Section with Dynamic Rotating Background */}
            <section className="relative overflow-hidden border-b border-slate-200/80 bg-white/40 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="relative mx-auto flex min-h-[460px] sm:min-h-[500px] w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                {/* 10 Curated Indonesian News Background Images with Smooth Cross-Fade */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  {INDONESIA_NEWS_BACKGROUNDS.map((bg, idx) => (
                    <div
                      key={bg.src}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentBgIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={bg.src}
                        alt={bg.alt}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        className="object-cover object-center transform scale-105"
                      />
                    </div>
                  ))}

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white dark:from-zinc-950/92 dark:via-zinc-950/88 dark:to-zinc-950 backdrop-blur-[2px]" />
                </div>

                {/* News Context Indicator Badge */}
                <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-2xs backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {INDONESIA_NEWS_BACKGROUNDS[currentBgIndex].tag}:
                  </span>
                  <span className="truncate max-w-[220px] sm:max-w-md">
                    {INDONESIA_NEWS_BACKGROUNDS[currentBgIndex].title}
                  </span>
                </div>

                {/* Hero Title & Subtitle */}
                <div className="relative z-10 max-w-3xl space-y-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                    Verifikasi Kebenaran Berita.{" "}
                    <span className="text-[#185adb] dark:text-blue-400">Abadi di Blockchain.</span>
                  </h1>
                  <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    Lawan disinformasi dan ralat redaksi diam-diam. Sistem AI multi-sumber menelusuri sumber primer resmi dan mengunci bukti kriptografis di jaringan Ethereum Sepolia.
                  </p>
                </div>

                {/* Unified Search Box (URL, Text, or File Upload) */}
                <div className="relative z-10 mt-8 w-full max-w-2xl">
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="flex items-center rounded-2xl border border-slate-300/90 bg-white/95 p-2 shadow-lg backdrop-blur-md transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900/95">
                      {/* Plus Button for File/Screenshot Upload */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition-all dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        title="Unggah Tangkapan Layar / Dokumen"
                      >
                        <Plus className="h-5 w-5" />
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.txt"
                        className="hidden"
                      />

                      {/* Input Field */}
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik topik klaim berita atau tempel tautan (URL) di sini..."
                        className="w-full bg-transparent px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-zinc-500"
                        disabled={isLoading}
                      />

                      {/* Submit / Analyze Button */}
                      <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#185adb] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">Menganalisis...</span>
                          </>
                        ) : (
                          <>
                            <span>Verifikasi</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Quick Topics */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="font-medium">Contoh klaim:</span>
                    {[
                      "Bansos Tunai 10 Juta Telegram",
                      "Undangan Pernikahan Format APK",
                      "Kenaikan Tarif Transfer BRI 150rb",
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleQuickTopic(topic)}
                        className="rounded-full bg-white/80 px-2.5 py-0.5 text-slate-600 hover:bg-white hover:text-[#185adb] transition-colors border border-slate-200/80 shadow-2xs dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-blue-400"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Verification Result Section - Only displayed when result exists or loading */}
            {(result || isLoading) && (
              <section id="verification-result-section" className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-20 animate-in fade-in duration-300">
                {serverNotice && (
                  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{serverNotice}</span>
                    </div>
                  </div>
                )}

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
                  <History className="h-6 w-6 text-[#185adb] dark:text-blue-400" strokeWidth={1.75} />
                  Riwayat Audit On-Chain
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Catatan riwayat verifikasi berita yang tersimpan di basis data terdesentralisasi & jaringan Ethereum Sepolia.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-900/60 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Terhubung ke Database Supabase
                </span>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold dark:text-blue-400 hover:underline"
                >
                  Etherscan Sepolia <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/90">
              {liveHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 sm:py-28 px-4 text-center">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 dark:bg-zinc-800/80 dark:border-zinc-700/60 text-slate-400 dark:text-zinc-500 mb-4 shadow-2xs">
                    <History className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-zinc-100">
                    Tidak Ada Riwayat
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm">
                    Belum ada catatan verifikasi berita atau audit blockchain on-chain yang tersimpan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Cek Fakta");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#185adb] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <Search className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Periksa Berita Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/90 font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      <tr>
                        <th className="p-3.5 sm:p-4">Judul Artikel</th>
                        <th className="p-3.5 sm:p-4">Skor AI</th>
                        <th className="p-3.5 sm:p-4">Status</th>
                        <th className="p-3.5 sm:p-4 hidden sm:table-cell">Article Hash</th>
                        <th className="p-3.5 sm:p-4">Waktu Audit</th>
                        <th className="p-3.5 sm:p-4">Transaksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {liveHistory.map((row) => {
                        const isHoaxStatus = row.status === "HOAX";
                        const isValidStatus = row.status === "VALID";
                        const isQuestionableStatus = row.status === "QUESTIONABLE";

                        return (
                          <tr
                            key={row.id}
                            className="hover:bg-blue-50/40 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-zinc-100 max-w-xs truncate">
                              {row.article_title || row.query_input || "Untitled"}
                            </td>
                            <td className="p-3.5 sm:p-4 font-bold font-mono">
                              <span
                                className={
                                  row.credibility_score >= 70
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : row.credibility_score >= 50
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-[#dc2626] dark:text-rose-400"
                                }
                              >
                                {row.credibility_score}/100
                              </span>
                            </td>
                            <td className="p-3.5 sm:p-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                  isHoaxStatus
                                    ? "bg-rose-50 text-[#dc2626] border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50"
                                    : isValidStatus
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/50"
                                    : isQuestionableStatus
                                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50"
                                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="p-3.5 sm:p-4 font-mono text-[11px] text-slate-600 dark:text-zinc-400 hidden sm:table-cell">
                              {shortenHash(row.article_hash, 6)}
                            </td>
                            <td className="p-3.5 sm:p-4 text-[11px] text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                              {formatDate(row.created_at)}
                            </td>
                            <td className="p-3.5 sm:p-4 font-mono text-xs text-[#185adb] dark:text-blue-400">
                              {row.tx_hash ? (
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${row.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline inline-flex items-center gap-1"
                                >
                                  {shortenHash(row.tx_hash, 6)}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-slate-500 dark:text-zinc-400 font-sans text-[11px]">
                                  Tersimpan di Supabase
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= TAB 4: TENTANG & METODOLOGI ================= */}
        {activeTab === "Tentang" && (
          <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-200 space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tentang VeritasChain
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Platform intelijen jurnalisme terdesentralisasi pertama di Indonesia yang menggabungkan verifikasi AI multi-sumber dengan integritas permanen teknologi blockchain.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#185adb] dark:text-blue-400 mb-4">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  AI Verifier Terkalibrasi
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Didukung model Google Gemini untuk mengekstraksi klaim, menganalisis 5W+1H, dan mencocokkan silang dengan korpus cek fakta nasional.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Bukti On-Chain Abadi
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Hasil analisis diarsip ke Pinata IPFS dan dicatat hash transaksi di Ethereum Sepolia sehingga tidak dapat disunting atau disangkal.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <GitCompare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Diff Viewer Redaksi
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Melacak perubahan kalimat pada portal berita secara visual (teks ralat diam-diam) dengan algoritma diff deterministik.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-300 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-[#185adb]" />
                <span className="font-extrabold text-lg tracking-tight text-white">VeritasChain</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Infrastruktur intelijen kebenaran publik berbasis AI dan buku besar kriptografis terdistribusi untuk integritas jurnalisme Indonesia.
              </p>
            </div>

            <div className="md:col-span-3 lg:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-white">Fitur Utama</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab("Cek Fakta")} className="hover:text-white transition-colors">
                    Cek Fakta Kilat
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("Berita Hoaks")} className="hover:text-white transition-colors">
                    Berita Hoaks Terkini
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("Riwayat")} className="hover:text-white transition-colors">
                    Riwayat Audit On-Chain
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 lg:col-span-4 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-white">Metodologi & Etika</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab("Tentang")} className="hover:text-white transition-colors">
                    Cara Kerja & Metodologi AI
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.ifcncodeofprinciples.poynter.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Standar Kode Etik IFCN
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/caanturuu/Tahu-Bulat-Paijo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Sumber Terbuka (Open Source)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 VeritasChain. Seluruh hak cipta dilindungi.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Kembali ke Atas ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoggedIn(true);
        }}
      />
      <FeatureDetailModal
        isOpen={selectedFeatureModal !== null}
        type={selectedFeatureModal}
        onClose={() => setSelectedFeatureModal(null)}
      />
    </div>
  );
}
