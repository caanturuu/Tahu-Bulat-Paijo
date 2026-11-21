"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
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

// 10 Curated News Context Backgrounds from User Upload
const INDONESIA_NEWS_BACKGROUNDS = [
  {
    src: "/news-bg/custom-wall-1.jpg",
    alt: "Wallpaper Latar Belakang 1",
    title: "Verifikasi Isu Publik & Informasi Viral 1",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-2.jpg",
    alt: "Wallpaper Latar Belakang 2",
    title: "Verifikasi Isu Publik & Informasi Viral 2",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-3.jpg",
    alt: "Wallpaper Latar Belakang 3",
    title: "Verifikasi Isu Publik & Informasi Viral 3",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-4.jpg",
    alt: "Wallpaper Latar Belakang 4",
    title: "Verifikasi Isu Publik & Informasi Viral 4",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-5.jpg",
    alt: "Wallpaper Latar Belakang 5",
    title: "Verifikasi Isu Publik & Informasi Viral 5",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-6.jpg",
    alt: "Wallpaper Latar Belakang 6",
    title: "Verifikasi Isu Publik & Informasi Viral 6",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-7.jpg",
    alt: "Wallpaper Latar Belakang 7",
    title: "Verifikasi Isu Publik & Informasi Viral 7",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-8.jpg",
    alt: "Wallpaper Latar Belakang 8",
    title: "Verifikasi Isu Publik & Informasi Viral 8",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-9.jpg",
    alt: "Wallpaper Latar Belakang 9",
    title: "Verifikasi Isu Publik & Informasi Viral 9",
    tag: "Berita Publik",
  },
  {
    src: "/news-bg/custom-wall-10.jpg",
    alt: "Wallpaper Latar Belakang 10",
    title: "Verifikasi Isu Publik & Informasi Viral 10",
    tag: "Berita Publik",
  },
];

// 15 Placeholder slots for Hoax News (Dummy data removed)
const HOAX_NEWS_PLACEHOLDERS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  tag: "[KATEGORI / HOAKS]",
  title: `[Slot Judul Berita Hoaks Terdeteksi #${i + 1}]`,
  date: "Menunggu data API",
}));

// Placeholder verification result for diff demo (Neutral template, no fake news)
const SAMPLE_DIFF_VERIFICATION_RESULT: VerificationResult = {
  url: "https://contoh-portal-berita.id/artikel-contoh",
  title: "[Contoh Demo Deteksi Revisi Redaksi]",
  publisher: "Portal Berita Contoh",
  publishedDate: "2026-11-21T08:00:00Z",
  articleHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  credibilityScore: 75,
  status: "QUESTIONABLE",
  summary:
    "Placeholder demonstrasi pelacakan revisi teks (Diff Viewer). Sistem mendeteksi perubahan kalimat pada artikel tanpa disertai ralat resmi dari pihak redaksi.",
  keyFindings: [
    "Versi awal memuat pernyataan awal sebelum disunting.",
    "Versi pembaruan memuat perubahan kata tanpa catatan ralat redaksi.",
    "Perbandingan visual disajikan dengan penanda merah (teks dihapus) dan hijau (teks ditambahkan).",
  ],
  claimsReview: [
    {
      claim: "Demonstrasi pelacakan perubahan kata pada artikel berita.",
      claimant: "Redaksi Media Contoh",
      claimDate: "2026-11-21",
      reviewPublisher: "VeritasChain Diff Engine v2",
      reviewUrl: "#",
      rating: "DIREVISI DIAM-DIAM",
    },
  ],
  ipfsCid: "QmPlaceholderDiffViewerDemoCID",
  txHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  network: "Ethereum Sepolia",
  timestamp: "2026-11-21T08:00:00Z",
  hasRevisions: true,
  diffSummary: {
    addedWords: 5,
    removedWords: 4,
    diffHtml:
      'Artikel ini memuat contoh kalimat dengan <span class="bg-rose-100 text-rose-800 line-through dark:bg-rose-950/70 dark:text-rose-300">klaim teks awal dihapus</span> digantikan menjadi <span class="bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-950/70 dark:text-emerald-300">penyuntingan teks baru ditambahkan</span> untuk mendemonstrasikan fitur pelacakan revisi.',
  },
};


export default function Home() {
  const { authenticated, user } = usePrivy();
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

  const isUserAuthenticated = authenticated || isLoggedIn;
  const currentUserAddress = user?.wallet?.address || (userEmail ? userEmail : "");

  // Hoax news search & filter state
  const [hoaxSearchQuery, setHoaxSearchQuery] = useState("");
  const [selectedHoaxCategory, setSelectedHoaxCategory] = useState("Semua");

  // Live database states from Supabase via FastAPI backend
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const [liveHoaxArticles, setLiveHoaxArticles] = useState<any[]>([]);

  // Function to refresh audit history for authenticated user
  const fetchLiveHistory = () => {
    if (!isUserAuthenticated || !currentUserAddress) {
      setLiveHistory([]);
      return;
    }
    fetch(`http://localhost:8000/api/history?user_address=${encodeURIComponent(currentUserAddress)}`)
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
    if (isUserAuthenticated && currentUserAddress) {
      fetchLiveHistory();
    } else {
      setLiveHistory([]);
    }
  }, [isUserAuthenticated, currentUserAddress]);

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

    // Jika belum login, wajibkan login terlebih dahulu agar pemeriksaan tercatat resmi
    if (!isUserAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    setIsLoading(true);
    setServerNotice(null);

    // Immediate smooth scroll feedback so user sees active verification right away
    setTimeout(() => {
      const el = document.getElementById("verification-result-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const addressToSend =
        user?.wallet?.address ||
        (userEmail ? userEmail : "0x0000000000000000000000000000000000000000");

      // Connect to real FastAPI backend if running
      const res = await fetch("http://localhost:8000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          userAddress: addressToSend,
        }),
      });

      if (res.ok) {
        const liveData = await res.json();
        setResult(liveData);
        fetchLiveHistory();
      } else {
        // Backend returned non-200, keep card empty (no dummy data)
        setResult(null);
        setServerNotice(
          `Kueri diterima: "${query.trim()}". Backend merespons status ${res.status}. Data dummy telah dinonaktifkan, card tetap dalam kondisi kosong.`
        );
      }
    } catch {
      // Backend offline / not running: keep card empty (no dummy data)
      setResult(null);
      setServerNotice(
        `Kueri diterima: "${query.trim()}". Server backend FastAPI (http://localhost:8000) belum aktif. Card tetap ditampilkan dalam kondisi kosong tanpa data dummy.`
      );
    } finally {
      setIsLoading(false);
      // Final re-align smoothly to results section
      setTimeout(() => {
        const el = document.getElementById("verification-result-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
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
  const renderHoaxNewsSection = () => {
    const filteredHoaxPlaceholders = HOAX_NEWS_PLACEHOLDERS.filter((item) => {
      const q = hoaxSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        item.id.toString() === q.replace("#", "");

      const matchesCat =
        selectedHoaxCategory === "Semua" ||
        item.tag.toLowerCase().includes(selectedHoaxCategory.toLowerCase());

      return matchesQuery && matchesCat;
    });

    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Berita Hoax Terkini
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Tampilan placeholder agregasi kabar keliru yang viral. Data live akan disinkronkan otomatis dari konsorsium jurnalisme resmi.
            </p>
          </div>

          {/* Search Bar & Category Filter */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 flex items-center rounded-lg border border-slate-200 bg-white p-1.5 sm:p-2 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-9 w-9 items-center justify-center text-slate-400 dark:text-zinc-500 shrink-0">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <input
                  type="text"
                  value={hoaxSearchQuery}
                  onChange={(e) => setHoaxSearchQuery(e.target.value)}
                  placeholder="Cari arsip berita hoaks, topik, atau kata kunci..."
                  className="w-full bg-transparent px-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                {hoaxSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setHoaxSearchQuery("")}
                    className="mr-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#185adb] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all shrink-0 cursor-pointer"
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
                  onClick={() => setSelectedHoaxCategory(cat)}
                  className={`rounded-lg px-3 py-1 font-medium transition-colors shrink-0 text-xs ${
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

        {/* Main Content: Hoax News Cards */}
        <div className="w-full">
          {filteredHoaxPlaceholders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <FileSearch className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600 mb-2" strokeWidth={1.5} />
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Tidak ada slot berita hoaks yang cocok dengan pencarian &quot;{hoaxSearchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={() => {
                  setHoaxSearchQuery("");
                  setSelectedHoaxCategory("Semua");
                }}
                className="mt-3 text-xs font-semibold text-[#185adb] hover:underline"
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {liveHoaxArticles.length > 0 ? (
                liveHoaxArticles
                  .filter((item) => {
                    const q = hoaxSearchQuery.toLowerCase().trim();
                    return (
                      !q ||
                      item.title?.toLowerCase().includes(q) ||
                      item.category?.toLowerCase().includes(q) ||
                      item.narasi?.toLowerCase().includes(q)
                    );
                  })
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/berita-hoax/${item.id}`}
                      className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-[#185adb] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 transition-all duration-200"
                    >
                      <div>
                        {/* Thumbnail Image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
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
                  ))
              ) : (
                filteredHoaxPlaceholders.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-lg border border-dashed border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900/80 transition-all duration-200"
                  >
                    <div>
                      {/* Thumbnail Image Placeholder */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100/80 dark:bg-zinc-800/60 border border-dashed border-slate-200/80 dark:border-zinc-700/60 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 p-3 text-center">
                        <FileSearch className="h-7 w-7 mb-1 opacity-60 text-slate-400" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium tracking-tight">Slot Gambar Berita #{item.id}</span>
                      </div>

                      {/* Title & Tag Placeholder */}
                      <div className="mt-3.5 space-y-1.5">
                        <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 border border-slate-200/80 rounded px-1.5 py-0.5 dark:border-zinc-800">
                          {item.tag}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-400 dark:text-zinc-500 line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Footer Info Placeholder */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-zinc-800/80">
                      <span className="text-slate-400 dark:text-zinc-500 font-medium">
                        {item.date}
                      </span>
                      <span className="font-semibold text-slate-400 dark:text-zinc-500 flex items-center gap-0.5">
                        Menunggu Data →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination bar for placeholder items */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-dashed border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Menampilkan <strong className="text-slate-800 dark:text-zinc-200">1 - {filteredHoaxPlaceholders.length}</strong> dari <strong>{HOAX_NEWS_PLACEHOLDERS.length}</strong> slot data kosong
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                disabled
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-400 opacity-60 cursor-not-allowed dark:border-zinc-800"
              >
                ← Sebelumnya
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#185adb] px-3 py-1.5 font-bold text-white shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                2
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                3
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfb] text-slate-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
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
          {/* Hero Section with 10 Rotating Indonesian News Backgrounds (Every 15s) - Full Viewport Fit */}
          <section className="relative w-full overflow-hidden bg-slate-900 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 sm:py-20 lg:py-24">
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

              {/* Top soft contrast overlay for photography background */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/30 to-white/95 dark:from-black/40 dark:via-zinc-950/40 dark:to-zinc-950 z-2" />

              {/* Bottom gradient fade into page body */}
              <div className="absolute bottom-0 inset-x-0 h-48 sm:h-72 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-zinc-950 dark:via-zinc-950/85 z-2" />
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-3 sm:px-6 pt-10 pb-20 sm:pt-16 sm:pb-32 lg:pt-20 lg:pb-40 text-center my-auto">
              {/* Luminous ambient halo behind title for crystal clear legibility on all photos */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-56 rounded-full bg-white/70 blur-3xl pointer-events-none -z-10 dark:bg-black/60" />

              {/* Editorial Serif Headline (Crisp contrast on light, dark, and dynamic photography) */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold font-serif text-slate-900 leading-[1.18] tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] drop-shadow-[0_1px_3px_rgba(255,255,255,1)] dark:text-white dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] px-2">
                Berita apa yang ingin
                <br />
                Anda periksa hari ini?
              </h1>

              {/* Floating Pill Search Bar */}
              <div className="mt-6 sm:mt-10 mx-auto w-full max-w-2xl px-1 sm:px-0">
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center rounded-lg bg-white p-1.5 sm:p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100/90 transition-all hover:shadow-[0_16px_50px_rgba(0,0,0,0.16)] dark:bg-zinc-900 dark:border-zinc-800"
                >
                  {/* Plus Button for screenshot upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    title="Unggah tangkapan layar berita"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
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
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-[#185adb] text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all shrink-0 disabled:opacity-70"
                    title="Periksa Sekarang"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" strokeWidth={1.75} />
                    ) : (
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Verification Result Section: Only appears when examining or result exists */}
          {(result || isLoading) && (
            <section id="verification-result-section" className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-10 sm:py-16 scroll-mt-20 animate-in fade-in duration-300">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-zinc-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 dark:text-white tracking-tight">
                    <FileSearch className="h-5 w-5 text-[#185adb] dark:text-blue-400" strokeWidth={1.75} />
                    Hasil Pemeriksaan Fakta & Audit Blockchain
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Hasil analisis verifikasi AI dan pencatatan audit on-chain.
                  </p>
                </div>
                {result && (
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setServerNotice(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Tutup Hasil & Kembali
                  </button>
                )}
              </div>

              {/* Server notice banner if backend is offline */}
              {serverNotice && (
                <div className="mb-6 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200 flex items-start justify-between gap-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold shrink-0 text-[#185adb] dark:text-blue-400">Info:</span>
                    <span className="leading-relaxed">{serverNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setServerNotice(null)}
                    className="font-bold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 shrink-0 cursor-pointer"
                    title="Tutup pemberitahuan"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ResultCard: Displays verified data */}
              <ResultCard data={result} isLoading={isLoading} />
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
                Riwayat Audit On-Chain (Ethereum Sepolia)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Catatan bukti verifikasi berita yang tersimpan abadi di ledger blockchain untuk akun Anda.
              </p>
            </div>
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold dark:text-blue-400 hover:underline"
            >
              Buka Sepolia Etherscan <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {!isUserAuthenticated ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Riwayat Pemeriksaan Terkunci
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                Riwayat pemeriksaan berita bersifat pribadi dan hanya dapat diakses oleh Anda. Silakan masuk terlebih dahulu untuk melihat catatan verifikasi akun Anda.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#185adb] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#154db8] transition-colors cursor-pointer"
                >
                  Masuk untuk Melihat Riwayat
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
              {/* Informative top banner */}
              <div className="border-b border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700 dark:text-zinc-200">
                    Akun: {shortenHash(currentUserAddress, 8)}
                  </span>
                  <span>•</span>
                  <span>
                    {liveHistory.length > 0
                      ? `Menampilkan ${liveHistory.length} riwayat audit terverifikasi Anda.`
                      : "Belum ada riwayat audit tersimpan untuk akun Anda."}
                  </span>
                </div>
              </div>

              {liveHistory.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                  Belum ada catatan verifikasi berita untuk akun ini. Periksa berita di halaman utama untuk mencatat riwayat pertama Anda.
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
                        <th className="p-3.5 sm:p-4">Transaksi / Penyimpanan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-zinc-800 dark:text-zinc-300">
                      {liveHistory.map((row) => {
                        const isHoaxStatus = row.status === "HOAX";
                        const isValidStatus = row.status === "VALID";
                        const isQuestionableStatus = row.status === "QUESTIONABLE";

                        return (
                          <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="p-3.5 sm:p-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                              {row.article_title}
                            </td>
                            <td className="p-3.5 sm:p-4 font-bold font-mono">
                              <span
                                className={
                                  row.credibility_score >= 80
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
          )}
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
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ethereum Sepolia</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Pencatatan bukti on-chain transparan dan bebas gas (*gasless relayer*) menggunakan standar EIP-712.
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
              Tahu Bulat PAIJO - Astra Polytechnic
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

      {/* Footer (Matching Reference UI) */}
      <footer className="mt-auto bg-[#070b14] text-slate-300 border-t border-slate-800/80 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Main 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Column 1: Brand Logo, Description & Social Links */}
            <div className="md:col-span-6 lg:col-span-5 space-y-4">
              {/* Brand Logo */}
              <div
                className="flex items-center gap-2.5 cursor-pointer w-fit"
                onClick={() => {
                  setActiveTab("Cek Fakta");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 7L13.5 25.5L17.5 19.5L12 7H6Z" fill="#38bdf8" />
                    <path
                      d="M13.5 25.5L17.5 29.5L29 7H23L16 21.5L13.5 25.5Z"
                      fill="#185adb"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  VeritasChain
                </span>
              </div>

              {/* Bio / Description */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-400 max-w-md">
                VeritasChain adalah platform verifikasi disinformasi dan pelacakan perubahan artikel berita berbasis kecerdasan buatan multimodal dan konsensus terdesentralisasi on-chain.
              </p>

              {/* Social Media Buttons Row */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* X / Twitter */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-xs"
                  title="X (Twitter)"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/caanturuu/Tahu-Bulat-Paijo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-xs"
                  title="GitHub Repository"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-xs"
                  title="Instagram"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-xs"
                  title="LinkedIn"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* Mail / Email */}
                <a
                  href="mailto:contact@veritaschain.id"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-xs"
                  title="Email Kami"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Fitur Utama */}
            <div className="md:col-span-3 lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                FITUR UTAMA
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Cek Fakta");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Cek Fakta Kilat
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Berita Hoaks");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Berita Hoaks Terkini
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Riwayat");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Riwayat Audit On-Chain
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Metodologi & Etika */}
            <div className="md:col-span-3 lg:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                METODOLOGI & ETIKA
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Tentang");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
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
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Tentang");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Kebijakan Hak Jawab & Koreksi
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/caanturuu/Tahu-Bulat-Paijo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Transparansi & Sumber Terbuka
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Sub-Footer Bar */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p className="text-center sm:text-left">
              © 2026 VeritasChain. Seluruh hak cipta dilindungi. • Dibangun di atas Ethereum Sepolia untuk Indonesia.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer shrink-0"
            >
              Kembali ke Atas ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
