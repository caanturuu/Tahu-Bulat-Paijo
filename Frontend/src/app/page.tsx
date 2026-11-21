"use client";

import React, { useState } from "react";
import { HeroInput } from "@/components/HeroInput";
import { ResultCard } from "@/components/ResultCard";
import { VerificationMode, VerificationResult } from "@/types";
import { Shield, Sparkles, Database, CheckCircle, FileCheck, Layers } from "lucide-react";

// Mock preset result for demonstration & testing
const DEMO_HOAX_RESULT: VerificationResult = {
  url: "https://turnbackhoax.id/contoh-klaim-politik",
  title: "Klaim Subsidi Energi Dicabut Total Mulai Akhir Bulan Ini",
  publisher: "TurnBackHoax.id (MAFINDO)",
  publishedDate: "2026-11-20T10:00:00Z",
  articleHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  credibilityScore: 18,
  status: "HOAX",
  summary:
    "Klaim bahwa subsidi energi dicabut secara total telah dibantah oleh siaran pers resmi Kementerian ESDM dan Kementerian Keuangan. Narasi yang beredar di media sosial memotong pernyataan pejabat dan menyebarkan judul disinformasi tanpa konteks anggaran sebenarnya.",
  keyFindings: [
    "Pemerintah tidak pernah mengumumkan pencabutan subsidi energi total per akhir bulan.",
    "Data alokasi APBN 2026 menunjukkan anggaran subsidi BBM dan listrik tetap berjalan normal.",
    "Pola penyebaran informasi menggunakan tangkapan layar editan tanpa tautan berita terverifikasi.",
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
      claim: "Anggaran subsidi BBM telah dihapus dari APBN 2026.",
      claimant: "Akun X / Twitter Anonim",
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

const DEMO_MODIFIED_RESULT: VerificationResult = {
  ...DEMO_HOAX_RESULT,
  title: "Pemerintah Menyesuaikan Skema Subsidi Tertarget Mulai Kuartal Mendatang",
  credibilityScore: 68,
  status: "QUESTIONABLE",
  summary:
    "Artikel telah mengalami revisi editorial. Kalimat provokatif di paragraf pertama telah diubah dan redaksi menambahkan klarifikasi dari kementerian terkait.",
  hasRevisions: true,
  diffSummary: {
    addedWords: 142,
    removedWords: 89,
    diffHtml:
      "Pemerintah melalui Kementerian ESDM mengonfirmasi bahwa <del>subsidi energi akan dihapus total secara mendadak</del> <ins>akan dilakukan penyesuaian penyaluran subsidi secara bertahap agar lebih tepat sasaran bagi masyarakat berpenghasilan rendah</ins>. Kebijakan ini diambil berdasarkan evaluasi distribusi kuartal sebelumnya.",
  },
};

export default function Home() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (mode: VerificationMode, content: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      // If backend API is reachable in the future, fetch from it:
      // const res = await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ mode, content }) });
      // For now, demonstrate seamless UI flow with mock simulation:
      await new Promise((resolve) => setTimeout(resolve, 1800));

      if (mode === "rescan") {
        setResult(DEMO_MODIFIED_RESULT);
      } else {
        setResult(DEMO_HOAX_RESULT);
      }
    } catch (err) {
      console.error("Gagal melakukan verifikasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-16">
      {/* Hero Headline */}
      <div className="mx-auto max-w-3xl text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Didukung Gemini 2.0 Flash & Base Sepolia L2</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
          Verifikasi Berita & Lacak Revisi Artikel Secara{" "}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Terdesentralisasi
          </span>
        </h1>
        <p className="text-sm text-zinc-400 sm:text-base leading-relaxed">
          Deteksi hoaks secara instan dengan basis data konsorsium cek fakta nasional,
          simpan sidik jari digital artikel permanen di blockchain, dan pantau jika berita diedit secara diam-diam.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="w-full max-w-3xl mx-auto">
        <HeroInput onVerify={handleVerify} isLoading={isLoading} />
      </div>

      {/* Results Section */}
      <div className="w-full max-w-3xl mx-auto mt-10">
        {result ? (
          <ResultCard data={result} />
        ) : (
          /* Value Proposition Grid (Shown before verification) */
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 mb-3 border border-blue-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Cek Fakta Nasional
              </h4>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Terhubung dengan Google Fact Check API yang mencakup MAFINDO, Kompas, Tempo, Liputan6, dan AFP.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-400 mb-3 border border-emerald-500/20">
                <Database className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Audit Trail Permanen
              </h4>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Bukti hasil verifikasi dan snapshot teks dipin ke IPFS serta dicatat di smart contract Base Sepolia.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/10 text-amber-400 mb-3 border border-amber-500/20">
                <FileCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Deteksi Revisi Diam-Diam
              </h4>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                Fitur rescan membandingkan hash artikel baru dan menyorot kata yang diedit/dihapus secara visual.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Layers className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-zinc-400">Tahu Bulat PAIJO</span>
          <span>•</span>
          <span>HackSphere 2026</span>
        </div>
        <p>VeritasChain: Decentralized News Verification and Article Change Tracking</p>
      </footer>
    </main>
  );
}
