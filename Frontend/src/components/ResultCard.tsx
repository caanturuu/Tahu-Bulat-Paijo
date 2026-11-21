"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  CheckCheck,
  Building2,
  Calendar,
} from "lucide-react";
import { VerificationResult } from "@/types";
import { getScoreBadge, formatDate } from "@/lib/utils";
import { ProofBadge } from "./ProofBadge";
import { DiffViewer } from "./DiffViewer";

interface ResultCardProps {
  data: VerificationResult;
}

export function ResultCard({ data }: ResultCardProps) {
  const badge = getScoreBadge(data.credibilityScore);

  return (
    <div className="space-y-6">
      {/* Main Analysis Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        {/* Header: Score & Title */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}
              >
                {data.credibilityScore >= 80 ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : data.credibilityScore >= 50 ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {badge.label}
              </span>

              {data.publisher && (
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {data.publisher}
                </span>
              )}

              {data.publishedDate && (
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {formatDate(data.publishedDate)}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
              {data.title}
            </h3>

            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#185adb] hover:underline dark:text-blue-400 break-all"
              >
                <span>{data.url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            )}
          </div>

          {/* Credibility Score Meter */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 min-w-[120px] sm:min-w-[140px] shrink-0 self-start sm:self-auto dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400">
              Credibility Score
            </span>
            <div className="my-1 flex items-baseline">
              <span
                className={`text-4xl font-extrabold tracking-tight ${badge.textColor}`}
              >
                {data.credibilityScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  data.credibilityScore >= 80
                    ? "bg-emerald-500"
                    : data.credibilityScore >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${data.credibilityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Reasoning Summary (Gemini 2.0 Flash) */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5 dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#185adb] dark:text-blue-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Analisis & Pertimbangan AI (Gemini 2.0 Flash)</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-zinc-200">
            {data.summary}
          </p>

          {data.keyFindings && data.keyFindings.length > 0 && (
            <div className="mt-3.5 space-y-1.5 border-t border-blue-100 dark:border-blue-900/40 pt-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Poin Kunci Temuan:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                {data.keyFindings.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fact Check Matches (Google Fact Check Tools API / ClaimReview) */}
        {data.claimsReview && data.claimsReview.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-3">
              <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Rujukan Cek Fakta Resmi (ClaimReview Database)</span>
            </div>
            <div className="space-y-2.5">
              {data.claimsReview.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/70"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">
                      "{item.claim}"
                    </p>
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-bold text-slate-700 text-[10px] shrink-0 self-start sm:self-auto dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      Rating: {item.rating}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-zinc-400 text-[11px] border-t border-slate-200/50 dark:border-zinc-800 pt-2">
                    <span>Pemeriksa: <strong>{item.reviewPublisher}</strong></span>
                    <a
                      href={item.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#185adb] dark:text-blue-400 hover:underline"
                    >
                      Baca Laporan Lengkap
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
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
