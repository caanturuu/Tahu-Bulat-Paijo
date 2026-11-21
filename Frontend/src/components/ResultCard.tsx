"use client";

import React from "react";
import { ExternalLink, Database } from "lucide-react";
import { VerificationResult } from "@/types";
import { formatDate, getScoreStatusText } from "@/lib/utils";
import { ProofBadge } from "./ProofBadge";
import { DiffViewer } from "./DiffViewer";

interface ResultCardProps {
  data?: VerificationResult | null;
}

export function ResultCard({ data }: ResultCardProps) {
  // If data is empty / null, render the clean Card Kosong (Empty Card)
  if (!data) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Section: Badges, Title, Placeholder + Right Score Card */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 space-y-2">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                MENUNGGU ANALISIS
              </span>
              <span className="rounded-md border border-dashed border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
                CARD KOSONG
              </span>
              <span className="text-slate-300 dark:text-zinc-700">|</span>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                Belum ada sumber berita yang dimuat
              </span>
            </div>

            {/* Headline Placeholder */}
            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-slate-400 dark:text-zinc-500 leading-snug pt-1">
              [Hasil Pemeriksaan Fakta & Audit Blockchain Akan Tampil di Sini]
            </h3>

            {/* Subtext Placeholder */}
            <p className="text-xs text-slate-400 dark:text-zinc-500 pt-0.5 leading-relaxed">
              Ketik topik berita, tempel tautan artikel, atau unggah tangkapan layar pada bilah pencarian di atas untuk memulai verifikasi.
            </p>
          </div>

          {/* Right Floating Card: Skor Kredibilitas (Empty State) */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:p-5 w-full sm:w-44 shrink-0 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/60 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
              Skor Kredibilitas
            </span>

            <div className="my-1.5 flex items-baseline justify-center">
              <span className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-slate-300 dark:text-zinc-600">
                --
              </span>
              <span className="text-xs font-bold text-slate-300 dark:text-zinc-600 ml-0.5">
                /100
              </span>
            </div>

            {/* Empty Progress Bar */}
            <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden dark:bg-zinc-800">
              <div className="h-full rounded-full bg-transparent w-0" />
            </div>

            <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              BELUM DIUJI
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-zinc-800/80 w-full text-center">
              <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                Dipublikasikan:
              </div>
              <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                --
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card: Analisis & Fakta Terkait (Empty State) */}
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-white p-5 sm:p-7 shadow-2xs pl-6 sm:pl-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute left-0 inset-y-0 w-1.5 bg-slate-300 dark:bg-zinc-700" />

          <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Analisis & Fakta Terkait
          </h4>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-400 dark:text-zinc-500 leading-relaxed italic">
            Hasil penalaran semantik mendalam dari Google Gemini 2.0 Flash mengenai konteks berita, keabsahan rilis kementerian, dan kebenaran narasi akan dimuat di sini.
          </p>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
            <h5 className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              Indikator yang Akan Diuji:
            </h5>
            <ul className="space-y-2 text-xs text-slate-400 dark:text-zinc-500">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 font-bold text-sm leading-none mt-0.5 shrink-0">•</span>
                <span>Pemeriksaan rilis resmi dari kementerian, lembaga pemerintah, atau instansi terkait.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 font-bold text-sm leading-none mt-0.5 shrink-0">•</span>
                <span>Pencocokan data anggaran, statistik resmi (BPS / APBN), atau dokumen regulasi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 font-bold text-sm leading-none mt-0.5 shrink-0">•</span>
                <span>Deteksi anomali audio kecerdasan buatan (deepfake) dan tangkapan layar editan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Sumber Verifikasi & Cek Fakta (Empty State) */}
        <div className="space-y-3 pt-2">
          <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Sumber Verifikasi & Cek Fakta
          </h4>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 sm:p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed">
              Daftar artikel verifikasi dari konsorsium pemeriksa fakta terakreditasi IFCN (MAFINDO, Kompas Cek Fakta, Tempo, Liputan6, AFP) akan dimuat secara otomatis setelah proses pencarian.
            </p>
          </div>
        </div>

        {/* On-Chain & IPFS Proof (Empty State) */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
              <Database className="h-4 w-4 text-slate-400 dark:text-zinc-500" strokeWidth={1.75} />
              Bukti Kriptografis & On-Chain (Base L2)
            </h4>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
              Status: Menunggu Transaksi
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">
                SHA-256 Article Hash
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 dark:text-zinc-600 font-medium">
                  0x0000...0000
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">
                IPFS Snapshot (Pinata)
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 dark:text-zinc-600 font-medium">
                  Qm0000...0000
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">
                On-Chain Ledger (BaseScan)
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 dark:text-zinc-600 font-medium">
                  Belum tercatat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal populated state when real data is available
  const scoreInfo = getScoreStatusText(data.credibilityScore);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Badges, Title, Link + Right Score Card */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-2">
          {/* Top Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            {data.credibilityScore < 50 ? (
              <>
                <span className="rounded-md bg-[#dc2626] px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                  KLAIM SALAH
                </span>
                <span className="rounded-md border border-rose-300 bg-rose-50/70 px-2.5 py-1 text-[11px] font-bold text-[#dc2626] uppercase tracking-wider dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  HOAKS
                </span>
              </>
            ) : data.credibilityScore < 80 ? (
              <>
                <span className="rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                  PERLU VERIFIKASI
                </span>
                <span className="rounded-md border border-amber-300 bg-amber-50/70 px-2.5 py-1 text-[11px] font-bold text-amber-700 uppercase tracking-wider dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                  MERAGUKAN
                </span>
              </>
            ) : (
              <>
                <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                  FAKTA VALID
                </span>
                <span className="rounded-md border border-emerald-300 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                  TERVERIFIKASI
                </span>
              </>
            )}

            <span className="text-slate-300 dark:text-zinc-700">|</span>

            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              {data.publisher ? (
                <>Beredar di {data.publisher}</>
              ) : (
                "Beredar di Media Sosial"
              )}
            </span>
          </div>

          {/* Main Headline */}
          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-snug pt-1">
            {data.title}
          </h3>

          {/* Source URL with external link icon */}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors break-all pt-0.5"
            >
              <span className="hover:underline">{data.url}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={1.75} />
            </a>
          )}
        </div>

        {/* Right Floating Card: Skor Kredibilitas */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 w-full sm:w-44 shrink-0 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
            Skor Kredibilitas
          </span>

          <div className="my-1.5 flex items-baseline justify-center">
            <span className={`text-4xl sm:text-[42px] font-extrabold tracking-tight ${scoreInfo.colorClass}`}>
              {data.credibilityScore}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 ml-0.5">
              /100
            </span>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreInfo.barColorClass}`}
              style={{ width: `${Math.max(data.credibilityScore, 8)}%` }}
            />
          </div>

          {/* SANGAT BURUK / MERAGUKAN / SANGAT BAIK */}
          <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${scoreInfo.colorClass}`}>
            {scoreInfo.text}
          </div>

          {/* Divider & Published Timestamp */}
          {data.publishedDate && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 w-full text-center">
              <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                Dipublikasikan:
              </div>
              <div className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 mt-0.5 whitespace-nowrap">
                {formatDate(data.publishedDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Card: Analisis & Fakta Terkait (with Blue Left Accent Stripe) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm pl-6 sm:pl-8 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Blue Left Accent Bar */}
        <div className="absolute left-0 inset-y-0 w-1.5 bg-[#185adb]" />

        <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Analisis & Fakta Terkait
        </h4>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          {data.summary}
        </p>

        {data.keyFindings && data.keyFindings.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
              Poin Kunci Temuan:
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
              {data.keyFindings.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#185adb] font-bold text-sm leading-none mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Section: Sumber Verifikasi & Cek Fakta */}
      {data.claimsReview && data.claimsReview.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Sumber Verifikasi & Cek Fakta
          </h4>

          <div className="space-y-3">
            {data.claimsReview.map((item, idx) => {
              const isHoax =
                item.rating.toLowerCase().includes("palsu") ||
                item.rating.toLowerCase().includes("salah") ||
                item.rating.toLowerCase().includes("hoaks") ||
                item.rating.toLowerCase().includes("hoax");
              const isMisleading =
                item.rating.toLowerCase().includes("menyesatkan") ||
                item.rating.toLowerCase().includes("meragukan");

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      "{item.claim}"
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 self-start sm:self-auto border ${
                        isHoax
                          ? "bg-rose-50 text-[#dc2626] border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60"
                          : isMisleading
                          ? "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60"
                      }`}
                    >
                      Penilaian: {item.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                    <span>
                      Pemeriksa: <strong className="text-slate-700 dark:text-zinc-200 font-semibold">{item.reviewPublisher}</strong>
                    </span>
                    <a
                      href={item.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#185adb] dark:text-blue-400 hover:underline"
                    >
                      <span>Baca Laporan Lengkap</span>
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Change Detection (Diff Viewer) if article modified */}
      {data.hasRevisions && (
        <DiffViewer
          addedWords={data.diffSummary?.addedWords}
          removedWords={data.diffSummary?.removedWords}
          diffHtml={data.diffSummary?.diffHtml}
        />
      )}

      {/* On-Chain & IPFS Proof */}
      <ProofBadge
        articleHash={data.articleHash}
        ipfsCid={data.ipfsCid}
        txHash={data.txHash}
        timestamp={data.timestamp}
      />
    </div>
  );
}
