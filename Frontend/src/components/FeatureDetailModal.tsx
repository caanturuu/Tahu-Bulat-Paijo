"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  History,
  ExternalLink,
  Globe,
  Cpu,
  Zap,
  Lock,
  GitCompare,
  ArrowRight,
  Sparkles,
  Database,
  Search,
  Check,
} from "lucide-react";

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "konsorsium" | "blockchain" | "diff" | null;
  onSelectSampleQuery?: (query: string) => void;
  onLoadDiffDemo?: () => void;
}

export function FeatureDetailModal({
  isOpen,
  onClose,
  type,
  onSelectSampleQuery,
  onLoadDiffDemo,
}: FeatureDetailModalProps) {
  const [diffViewMode, setDiffViewMode] = useState<"diff" | "before" | "after">("diff");
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !type) return null;

  const handleCopyContract = () => {
    navigator.clipboard?.writeText("0x8a92B79e4368541FaBf2B954b8344e7314dCe41b");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 my-auto dark:bg-zinc-900 dark:border-zinc-800 text-slate-900 dark:text-zinc-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ================= TYPE 1: KONSORSIUM ================= */}
        {type === "konsorsium" && (
          <div>
            {/* Header Badge & Icon */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#185adb] shadow-xs dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
                <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60">
                  <Globe className="h-3 w-3 text-blue-600" /> Standardisasi Internasional
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Konsorsium Cek Fakta Resmi
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
              VeritasChain mengagregasi ribuan database klarifikasi hoaks dan penelusuran fakta secara real-time langsung dari jaringan pemeriksa fakta terakreditasi <strong>International Fact-Checking Network (IFCN)</strong> melalui protokol data terstruktur <em>ClaimReview Schema</em>.
            </p>

            {/* Partner Network Breakdown */}
            <div className="mb-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> Mitra Terintegrasi Langsung:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>MAFINDO (TurnBackHoax.id)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold">Pelopor RI</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    Jaringan lebih dari 1.000 relawan di seluruh Indonesia dengan arsip lebih dari 30.000 artikel hoaks.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Kompas.com Cek Fakta</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">IFCN Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    Verifikasi jurnalisme investigasi dengan konfirmasi narasumber primer dan dokumen negara resmi.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Tempo.co Cek Fakta</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">IFCN Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    Spesialisasi pembongkaran manipulasi kebijakan publik, narasi politik, dan deepfake audio/video.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>AFP Indonesia & Liputan6</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 px-1.5 py-0.5 rounded font-semibold">Global Bureau</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    Cakupan internasional Agence France-Presse untuk memverifikasi klaim luar negeri yang masuk ke Indonesia.
                  </p>
                </div>
              </div>
            </div>

            {/* How it works workflow */}
            <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40 mb-6">
              <h5 className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Cara Kerja Penyelarasan Otomatis:
              </h5>
              <ol className="text-xs text-slate-700 dark:text-zinc-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Input teks atau URL diekstraksi menjadi entitas semantik melalui AI NLP VeritasChain.</li>
                <li>Sistem mencari kecocokan vektor pada database gabungan ClaimReview dalam tempo &lt;800ms.</li>
                <li>Hasil disajikan lengkap dengan kutipan fakta resmi, rating kredibilitas, dan sumber penelusuran.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  if (onSelectSampleQuery) {
                    onSelectSampleQuery("Klaim pencabutan subsidi BBM dan tarif listrik 2026");
                  }
                  onClose();
                }}
                className="w-full sm:w-auto flex-1 rounded-xl bg-[#185adb] py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Search className="h-3.5 w-3.5" />
                Coba Uji Berita Contoh Sekarang
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ================= TYPE 2: BLOCKCHAIN ================= */}
        {type === "blockchain" && (
          <div>
            {/* Header Badge & Icon */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="h-7 w-7 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                  <Cpu className="h-3 w-3 text-emerald-600" /> Ethereum Sepolia Testnet
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Audit On-Chain Permanen
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
              Setiap kali berita diverifikasi, hasil audit dan sidik jari digital (SHA-256) dicetak langsung ke jaringan blockchain <strong>Ethereum Sepolia</strong> dan metadata disimpan abadi di <strong>IPFS</strong>. Tidak ada pihak manapun yang dapat menghapus bukti kebenaran yang sudah tercatat.
            </p>

            {/* Technical Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  Anti Manipulasi
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Cryptographic hashing memastikan data tidak bisa diedit setelah dicatat.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Bebas Gas Fee
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  EIP-4337 Paymaster menanggung seluruh biaya gas secara otomatis untuk publik.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <Database className="h-3.5 w-3.5 text-blue-500" />
                  IPFS Storage
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Tangkapan layar dan teks berita diarsipkan secara desentralisasi.
                </p>
              </div>
            </div>

            {/* Smart Contract Preview Box */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 font-mono text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20 mb-6">
              <div className="flex items-center justify-between font-sans mb-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" /> VeritasAudit Smart Contract
                </span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified On Etherscan
                </span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="truncate text-slate-700 dark:text-zinc-300 text-[11px]">
                  0x8a92B79e4368541FaBf2B954b8344e7314dCe41b
                </span>
                <button
                  type="button"
                  onClick={handleCopyContract}
                  className="ml-2 shrink-0 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-2 py-1 text-[10px] font-sans font-semibold transition-colors dark:bg-emerald-900/60 dark:text-emerald-300"
                >
                  {isCopied ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Buka Sepolia Etherscan Explorer
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ================= TYPE 3: DIFF TRACKING ================= */}
        {type === "diff" && (
          <div>
            {/* Header Badge & Icon */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-xs dark:bg-amber-950/60 dark:text-amber-400 shrink-0">
                <History className="h-7 w-7 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
                  <Zap className="h-3 w-3 text-amber-600" /> Diff Tracking AI v2
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Deteksi Revisi Diam-Diam
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-5">
              Banyak artikel berita daring disunting secara diam-diam (<em>silent editing</em>) beberapa jam setelah tayang tanpa menyertakan catatan ralat redaksi resmi. Algoritma Diff VeritasChain membandingkan snapshot awal dengan teks terbaru untuk membongkar modifikasi fakta.
            </p>

            {/* Interactive Live Diff Simulator Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 mb-6 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2.5 dark:border-zinc-800">
                <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <GitCompare className="h-4 w-4 text-amber-500" /> Simulasi Perbandingan Teks:
                </span>
                <div className="flex items-center rounded-lg bg-slate-200/70 p-0.5 text-[10px] font-semibold dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => setDiffViewMode("diff")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      diffViewMode === "diff"
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-zinc-900 dark:text-white"
                        : "text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    Visual Diff
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiffViewMode("before")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      diffViewMode === "before"
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-zinc-900 dark:text-white"
                        : "text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    Asli (08:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiffViewMode("after")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      diffViewMode === "after"
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-zinc-900 dark:text-white"
                        : "text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    Revisi (11:30)
                  </button>
                </div>
              </div>

              {/* Text Comparison Display */}
              <div className="rounded-xl bg-white p-3.5 font-sans text-xs sm:text-sm leading-relaxed border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80">
                {diffViewMode === "diff" && (
                  <div>
                    Pemerintah mengumumkan kebijakan terkait{" "}
                    <span className="bg-rose-100 text-rose-800 line-through px-1.5 py-0.5 rounded dark:bg-rose-950/70 dark:text-rose-300 font-medium">
                      pencabutan subsidi BBM dan kenaikan tarif secara mendadak
                    </span>{" "}
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded dark:bg-emerald-950/70 dark:text-emerald-300">
                      penyesuaian skema penyaluran bantuan subsidi energi tepat sasaran
                    </span>{" "}
                    mulai akhir bulan ini untuk seluruh konsumen umum.
                  </div>
                )}

                {diffViewMode === "before" && (
                  <div className="text-slate-700 dark:text-zinc-300">
                    Pemerintah mengumumkan kebijakan terkait{" "}
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      pencabutan subsidi BBM dan kenaikan tarif secara mendadak
                    </span>{" "}
                    mulai akhir bulan ini untuk seluruh konsumen umum.
                  </div>
                )}

                {diffViewMode === "after" && (
                  <div className="text-slate-700 dark:text-zinc-300">
                    Pemerintah mengumumkan kebijakan terkait{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      penyesuaian skema penyaluran bantuan subsidi energi tepat sasaran
                    </span>{" "}
                    mulai akhir bulan ini untuk seluruh konsumen umum.
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> 8 kata dihapus
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> 9 kata disisipkan
                </span>
                <span className="text-amber-600 font-semibold dark:text-amber-400">
                  ⚠️ Tanpa Catatan Redaksi
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  if (onLoadDiffDemo) {
                    onLoadDiffDemo();
                  }
                  onClose();
                }}
                className="w-full sm:w-auto flex-1 rounded-xl bg-amber-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <GitCompare className="h-3.5 w-3.5" />
                Buka Demonstrasi Hasil Diff Penuh
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
