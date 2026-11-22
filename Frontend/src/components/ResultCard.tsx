"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { VerificationResult } from "@/types";
import { formatDate } from "@/lib/utils";
import { ProofBadge } from "./ProofBadge";
import { DiffViewer } from "./DiffViewer";

interface ResultCardProps {
  data?: VerificationResult | null;
  isLoading?: boolean;
  onRetryRelay?: () => void;
}

export function ResultCard({ data, isLoading, onRetryRelay }: ResultCardProps) {
  // If loading, render single-card animated skeleton
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-7 animate-in fade-in duration-200">
        <div className="space-y-3 pb-5 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#185adb] uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            Sedang Memverifikasi Fakta...
          </div>
          <div className="h-7 w-3/4 bg-slate-200/70 rounded-lg animate-pulse" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-md animate-pulse" />
        </div>

        {/* Narasi skeleton */}
        <div className="space-y-2.5">
          <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="border-l-[3px] border-slate-300 pl-4 py-1 space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Penjelasan skeleton */}
        <div className="space-y-2.5">
          <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Kesimpulan skeleton */}
        <div className="space-y-2.5">
          <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // If data is empty / null, render the clean Card Kosong (Empty State) in one single card
  if (!data) {
    return (
      <div className="rounded-lg border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-7 animate-in fade-in duration-300 text-slate-800">
        {/* Header Placeholder */}
        <div className="space-y-2.5 pb-5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MENUNGGU ANALISIS
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-400 font-medium">
              Belum ada berita yang diuji
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-400 leading-snug">
            [Hasil Pemeriksaan Fakta & Audit Blockchain Akan Tampil di Sini]
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Ketik topik berita, tempel tautan artikel, atau unggah tangkapan layar pada bilah pencarian di atas untuk memulai verifikasi fakta.
          </p>
        </div>

        {/* 1. Narasi Placeholder */}
        <div className="space-y-2.5">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">Narasi</h4>
          <div className="border-l-[3px] border-slate-300 pl-4 sm:pl-5 py-1">
            <p className="text-xs sm:text-sm text-slate-400 italic">
              Kutipan klaim atau narasi viral yang disebarkan di media sosial atau grup percakapan akan dimuat di bagian ini.
            </p>
          </div>
        </div>

        {/* 2. Penjelasan Placeholder */}
        <div className="space-y-2.5">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">Penjelasan</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Penjelasan terperinci mengenai hasil penelusuran fakta, bukti sanggahan dari media resmi, dan klarifikasi instansi berwenang akan dimuat di sini.
          </p>
        </div>

        {/* 3. Kesimpulan Placeholder */}
        <div className="space-y-2.5">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">Kesimpulan</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Ringkasan tegas mengenai klasifikasi kebenaran informasi (Valid, Meragukan, atau Hoaks).
          </p>
        </div>

        {/* 4. Hasil Periksa fakta Placeholder */}
        <div className="space-y-2.5">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">Hasil Periksa fakta</h4>
          <div className="border-l-[3px] border-slate-300 pl-4 sm:pl-5 py-1 space-y-1 text-xs text-slate-400">
            <div className="font-bold">--</div>
            <div>Sumber: -</div>
          </div>
        </div>

        {/* 5. Referensi Placeholder */}
        <div className="space-y-2.5">
          <h4 className="text-base sm:text-lg font-bold text-slate-900">Referensi</h4>
          <p className="text-xs text-slate-400">Tautan sumber dan rujukan arsip.</p>
        </div>
      </div>
    );
  }

  // Non-news dedicated classification layout
  if (data.isNews === false) {
    return (
      <div className="rounded-lg border border-amber-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-6 animate-in fade-in duration-300 text-slate-800">
        <div className="space-y-2 pb-5 border-b border-amber-100">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            HASIL VALIDASI KONTEN
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            Input Terdeteksi Bukan Berita atau Klaim Isu Faktual
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {data.notNewsReason ||
              data.penjelasan ||
              "Teks atau tautan yang dimasukkan tidak teridentifikasi sebagai artikel berita, isu viral, atau rilis peristiwa publik yang memerlukan verifikasi fakta."}
          </p>
        </div>

        {data.keyFindings && data.keyFindings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900">Indikator Klasifikasi Sistem</h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 pl-1">
              {data.keyFindings.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Populated verification state (Unified Single Card matching reference)
  const isHoax = data.credibilityScore < 50;
  const isQuestionable = data.credibilityScore >= 50 && data.credibilityScore < 80;

  const verdictRating = isHoax
    ? "Salah"
    : isQuestionable
    ? "Sebagian Benar / Menyesatkan"
    : "Benar";

  // Build clean source & reference link lists
  const sourceUrls: string[] = [];
  if (data.url && data.url.startsWith("http")) {
    sourceUrls.push(data.url);
  }
  if (data.claimsReview && data.claimsReview.length > 0) {
    for (const cr of data.claimsReview) {
      if (cr.reviewUrl && !sourceUrls.includes(cr.reviewUrl)) {
        sourceUrls.push(cr.reviewUrl);
      }
    }
  }

  const defaultReferences: string[] =
    sourceUrls.length > 0
      ? sourceUrls
      : [
          "https://turnbackhoax.id",
          "https://kompas.com/cekfakta",
          "https://cekfakta.tempo.co",
        ];

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-7 animate-in fade-in duration-300 text-slate-800">
      {/* 0. Top Section: Headline & Status Header */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {isHoax ? (
              <span className="rounded-md bg-rose-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-2xs">
                KLAIM SALAH / HOAKS
              </span>
            ) : isQuestionable ? (
              <span className="rounded-md bg-amber-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-2xs">
                MERAGUKAN / PERLU VERIFIKASI
              </span>
            ) : (
              <span className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-2xs">
                FAKTA VALID
              </span>
            )}
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
              Skor Kredibilitas: {data.credibilityScore}/100
            </span>
          </div>

          {data.publishedDate && (
            <span className="text-xs text-slate-400 font-medium">
              {formatDate(data.publishedDate)}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug pt-1">
          {data.title}
        </h3>

        {data.publisher && (
          <p className="text-xs text-slate-500 font-medium">
            Klaim terdeteksi beredar di: <span className="font-semibold text-slate-700">{data.publisher}</span>
          </p>
        )}
      </div>

      {/* 1. NARASI (Matching reference with vertical left-border quote) */}
      <div className="space-y-2.5">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">Narasi</h4>
        <div className="border-l-[3px] border-slate-400 pl-4 sm:pl-5 py-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
          <p>{data.narasi || data.title}</p>
        </div>
      </div>

      {/* 2. PENJELASAN */}
      <div className="space-y-2.5">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">Penjelasan</h4>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
          <p>{data.penjelasan || data.summary}</p>

          {data.keyFindings && data.keyFindings.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Poin Temuan Kunci:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                {data.keyFindings.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3. KESIMPULAN */}
      <div className="space-y-2.5">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">Kesimpulan</h4>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          <p>
            {data.kesimpulan ||
              `Faktanya, berdasarkan penelusuran fakta terverifikasi, klaim ini terbukti ${verdictRating.toLowerCase()}.`}
          </p>
        </div>
      </div>

      {/* 4. HASIL PERIKSA FAKTA (Vertical left-border rating box) */}
      <div className="space-y-2.5">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">Hasil Periksa fakta</h4>
        <div className="border-l-[3px] border-slate-700 pl-4 sm:pl-5 py-1 space-y-2">
          <div className="font-bold text-sm text-slate-900">{verdictRating}</div>
          <div className="text-xs text-slate-600 font-medium">Sumber:</div>
          <div className="space-y-1">
            {sourceUrls.length > 0 ? (
              sourceUrls.slice(0, 2).map((sUrl, idx) => (
                <div key={idx}>
                  <a
                    href={sUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#185adb] hover:underline font-medium break-all"
                  >
                    <span>{sUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">
                {data.publisher || "Pemeriksaan konsensus media & arsip rujukan resmi"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. REFERENSI (Clickable blue reference link list) */}
      <div className="space-y-2.5">
        <h4 className="text-base sm:text-lg font-bold text-slate-900">Referensi</h4>
        <div className="space-y-2">
          {defaultReferences.map((refUrl, idx) => (
            <div key={idx}>
              <a
                href={refUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#185adb] hover:underline font-medium break-all"
              >
                <span>{refUrl}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Revisions diff viewer if modified */}
      {data.hasRevisions && (
        <div className="pt-4 border-t border-slate-100">
          <DiffViewer
            addedWords={data.diffSummary?.addedWords}
            removedWords={data.diffSummary?.removedWords}
            diffHtml={data.diffSummary?.diffHtml}
          />
        </div>
      )}

      {/* On-Chain & IPFS Proof Section (Integrated into bottom of the same card) */}
      <div className="pt-6 border-t border-slate-100">
        <ProofBadge
          articleHash={data.articleHash}
          ipfsCid={data.ipfsCid}
          txHash={data.txHash}
          timestamp={data.timestamp}
          recordId={data.recordId}
          relayStatus={data.relayStatus}
          relayMessage={data.relayMessage}
          onRetryRelay={onRetryRelay}
        />
      </div>
    </div>
  );
}
