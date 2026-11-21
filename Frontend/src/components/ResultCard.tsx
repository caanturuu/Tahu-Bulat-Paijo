"use client";

import React from "react";
import {
  ExternalLink,
  Database,
  MessageSquareQuote,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Award,
  Link as LinkIcon,
  HelpCircle,
  Newspaper,
} from "lucide-react";
import { VerificationResult } from "@/types";
import { formatDate, getScoreStatusText } from "@/lib/utils";
import { ProofBadge } from "./ProofBadge";
import { DiffViewer } from "./DiffViewer";

interface ResultCardProps {
  data?: VerificationResult | null;
  notice?: string | null;
  onReset?: () => void;
}

export function ResultCard({ data, notice, onReset }: ResultCardProps) {
  // If data is empty / null, render the clean Card Kosong (Empty State)
  if (!data) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Header Placeholder */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                MENUNGGU ANALISIS
              </span>
              <span className="rounded-md border border-dashed border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
                CARD KOSONG
              </span>
              <span className="text-slate-300 dark:text-zinc-700">|</span>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                Belum ada berita yang diuji
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-400 dark:text-zinc-500 leading-snug pt-1">
              [Hasil Pemeriksaan Fakta & Audit Blockchain Akan Tampil di Sini]
            </h3>

            <p className="text-xs text-slate-400 dark:text-zinc-500 pt-0.5 leading-relaxed">
              Ketik topik berita, tempel tautan artikel, atau unggah tangkapan layar pada bilah di atas untuk memulai verifikasi 4 tahap: Narasi, Penjelasan, Kesimpulan, dan Hasil.
            </p>
          </div>

          {/* Skor Kredibilitas Placeholder */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:p-5 w-full sm:w-44 shrink-0 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/60 text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
              Skor Kredibilitas
            </span>
            <div className="my-1.5 flex items-baseline justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-300 dark:text-zinc-600">
                --
              </span>
              <span className="text-xs font-bold text-slate-300 dark:text-zinc-600 ml-0.5">
                /100
              </span>
            </div>
            <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden dark:bg-zinc-800">
              <div className="h-full rounded-full bg-transparent w-0" />
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              BELUM DIUJI
            </div>
          </div>
        </div>

        {/* 1. Narasi Placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquareQuote className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
              1. Narasi yang Beredar
            </h4>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
            Kutipan klaim atau narasi viral yang disebarkan di ruang publik akan dimuat di bagian ini.
          </p>
        </div>

        {/* 2. Penjelasan Placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
              2. Penjelasan Fakta
            </h4>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
            Uraian pembuktian fakta, pengecekan rilis lembaga resmi, dan penalaran semantik AI Gemini akan dijabarkan di sini.
          </p>
        </div>

        {/* 3. Kesimpulan Placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
              3. Kesimpulan
            </h4>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
            Kesimpulan ringkas dan tegas mengenai validitas isu akan ditampilkan di sini.
          </p>
        </div>

        {/* 4. Hasil & Link Sumber Placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
              4. Hasil & Sumber Rujukan
            </h4>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
            Kartu rujukan tautan berita resmi (MAFINDO, Kompas, Tempo) dan bukti hash on-chain Ethereum Sepolia akan dimuat di sini.
          </p>
        </div>
      </div>
    );
  }

  // State when input is NOT news
  if (data.isNews === false || data.status === "NOT_NEWS") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-6 sm:p-8 dark:border-amber-700/60 dark:bg-amber-950/20 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
              <HelpCircle className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                  BUKAN BERITA
                </span>
                <span className="rounded-md border border-amber-300 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-amber-800 uppercase tracking-wider dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-300">
                  HASIL VALIDASI KONTEN
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug pt-1">
                Input Terdeteksi Bukan Berita atau Klaim Isu Faktual
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed pt-1">
                {data.notNewsReason ||
                  data.penjelasan ||
                  "Teks atau tautan yang dimasukkan tidak teridentifikasi sebagai artikel berita, isu viral, atau rilis peristiwa publik yang memerlukan verifikasi fakta."}
              </p>
            </div>
          </div>

          {/* Temuan Analisis */}
          {data.keyFindings && data.keyFindings.length > 0 && (
            <div className="mt-5 pt-4 border-t border-amber-200/80 dark:border-amber-900/40 space-y-2">
              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Indikator Klasifikasi Sistem:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                {data.keyFindings.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Panduan Input yang Didukung */}
          <div className="mt-6 pt-5 border-t border-amber-200/80 dark:border-amber-900/40">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Kategori yang Dapat Diverifikasi di VeritasChain:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-white/90 dark:bg-zinc-900/90 p-3.5 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  1. Tautan Portal Berita
                </span>
                <p className="text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Masukkan link berita (Kompas, Detik, Tempo, Antara, dsb) untuk audit keaslian dan pelacakan revisi (diff).
                </p>
              </div>
              <div className="rounded-xl bg-white/90 dark:bg-zinc-900/90 p-3.5 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  2. Narasi / Kabar Viral
                </span>
                <p className="text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Salin teks klaim viral WhatsApp, rumor publik, atau isu medsos yang perlu dibuktikan kebenarannya.
                </p>
              </div>
              <div className="rounded-xl bg-white/90 dark:bg-zinc-900/90 p-3.5 border border-slate-200 dark:border-zinc-800 shadow-2xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  3. Bantuan & Regulasi
                </span>
                <p className="text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Klaim pembagian bansos, pendaftaran program pemerintah, atau kebijakan kementerian resmi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal populated state
  const scoreInfo = getScoreStatusText(data.credibilityScore);
  const isHoax = data.credibilityScore < 50;
  const isQuestionable = data.credibilityScore >= 50 && data.credibilityScore < 80;
  const isValid = data.credibilityScore >= 80;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Section: Header Title & Publication Details */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex-1 space-y-2">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-bold text-[#185adb] uppercase tracking-wider dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
              BERITA TERVERIFIKASI
            </span>
            {isHoax ? (
              <>
                <span className="rounded-md bg-[#dc2626] px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-2xs">
                  KLAIM SALAH
                </span>
                <span className="rounded-md border border-rose-300 bg-rose-50/70 px-2.5 py-1 text-[11px] font-bold text-[#dc2626] uppercase tracking-wider dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  HOAKS
                </span>
              </>
            ) : isQuestionable ? (
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
              {data.publisher ? `Beredar di ${data.publisher}` : "Beredar di Media Sosial / Daring"}
            </span>
          </div>

          {/* Main Headline */}
          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-snug pt-1">
            {data.title}
          </h3>

          {/* Source Link */}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#185adb] dark:text-zinc-400 dark:hover:text-blue-400 transition-colors break-all pt-0.5"
            >
              <span className="hover:underline">{data.url}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={1.75} />
            </a>
          )}
        </div>

        {/* Right Floating Score Card */}
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

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreInfo.barColorClass}`}
              style={{ width: `${Math.max(data.credibilityScore, 8)}%` }}
            />
          </div>

          <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${scoreInfo.colorClass}`}>
            {scoreInfo.text}
          </div>

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

      {/* 1. NARASI */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-amber-50/50 p-5 sm:p-6 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 mb-2.5">
          <MessageSquareQuote className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200 tracking-tight">
            1. Narasi yang Beredar
          </h4>
        </div>
        <div className="rounded-xl bg-white/80 dark:bg-zinc-900/80 p-4 border border-amber-200/60 dark:border-amber-900/30">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-medium italic">
            "{data.narasi || data.title}"
          </p>
        </div>
      </div>

      {/* 2. PENJELASAN */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm pl-6 sm:pl-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="absolute left-0 inset-y-0 w-1.5 bg-[#185adb]" />

        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-[#185adb] dark:text-blue-400" />
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            2. Penjelasan Fakta
          </h4>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {data.penjelasan || data.summary}
        </p>

        {data.keyFindings && data.keyFindings.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Temuan Kunci Penyelidikan:
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

      {/* 3. KESIMPULAN */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm ${
          isHoax
            ? "border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20"
            : isQuestionable
            ? "border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20"
            : "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20"
        }`}
      >
        <div className="flex items-center gap-2 mb-2.5">
          {isHoax ? (
            <XCircle className="h-5 w-5 text-[#dc2626] dark:text-rose-400" />
          ) : isQuestionable ? (
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          )}
          <h4
            className={`text-sm sm:text-base font-bold tracking-tight ${
              isHoax
                ? "text-rose-900 dark:text-rose-200"
                : isQuestionable
                ? "text-amber-900 dark:text-amber-200"
                : "text-emerald-900 dark:text-emerald-200"
            }`}
          >
            3. Kesimpulan
          </h4>
        </div>

        <div className="rounded-xl bg-white/90 dark:bg-zinc-900/90 p-4 border border-slate-200/60 dark:border-zinc-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed">
            {data.kesimpulan ||
              `Berdasarkan seluruh data rujukan fakta dan cross-check, informasi ini berstatus: ${data.status}.`}
          </p>
        </div>
      </div>

      {/* 4. HASIL (Kredibilitas & Link Sumber) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#185adb] dark:text-blue-400" />
          <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            4. Hasil Verifikasi & Link Sumber
          </h4>
        </div>

        {/* Skor & Status Summary Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Status Kredibilitas Akhir
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className={`text-2xl font-black ${scoreInfo.colorClass}`}>
                  {data.credibilityScore}/100
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isHoax
                    ? "bg-rose-50 text-[#dc2626] border-rose-200 dark:bg-rose-950/50 dark:border-rose-900"
                    : isQuestionable
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900"
                }`}>
                  {scoreInfo.text}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-zinc-400 sm:text-right max-w-sm">
              Tercatat pada basis data audit kebenaran informasi publik VeritasChain melalui konsensus AI & Pemeriksa Fakta Terakreditasi.
            </div>
          </div>
        </div>

        {/* Link Sumber Rujukan (ClaimReview) */}
        {data.claimsReview && data.claimsReview.length > 0 ? (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Tautan Sumber Pemeriksa Fakta Resmi:
            </h5>
            <div className="space-y-2.5">
              {data.claimsReview.map((item, idx) => {
                const isItemHoax =
                  item.rating.toLowerCase().includes("palsu") ||
                  item.rating.toLowerCase().includes("salah") ||
                  item.rating.toLowerCase().includes("hoaks") ||
                  item.rating.toLowerCase().includes("hoax");
                const isItemMisleading =
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
                          isItemHoax
                            ? "bg-rose-50 text-[#dc2626] border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60"
                            : isItemMisleading
                            ? "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60"
                        }`}
                      >
                        Penilaian: {item.rating}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-800/60">
                      <span>
                        Pemeriksa: <strong className="text-slate-800 dark:text-zinc-200 font-semibold">{item.reviewPublisher}</strong>
                      </span>
                      <a
                        href={item.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-[#185adb] dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/40"
                      >
                        <span>Buka Sumber Rujukan</span>
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
              <LinkIcon className="h-4 w-4 text-[#185adb] dark:text-blue-400 shrink-0" />
              <span>
                Tidak ditemukan arsip cek fakta spesifik sebelumnya di ClaimReview. Verifikasi dijalankan melalui analisis silang semantik Google Gemini terhadap konsensus fakta publik.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Detection (Diff Viewer) if article modified */}
      {data.hasRevisions && (
        <DiffViewer
          addedWords={data.diffSummary?.addedWords}
          removedWords={data.diffSummary?.removedWords}
          diffHtml={data.diffSummary?.diffHtml}
        />
      )}

      {/* On-Chain & IPFS Proof (Ethereum Sepolia) */}
      <ProofBadge
        articleHash={data.articleHash}
        ipfsCid={data.ipfsCid}
        txHash={data.txHash}
        timestamp={data.timestamp}
      />
    </div>
  );
}
