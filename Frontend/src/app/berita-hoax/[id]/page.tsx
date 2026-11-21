"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { VerificationResult } from "@/types";

function HoaxDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetch(`http://localhost:8000/api/hoax-articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Artikel hoaks tidak ditemukan.");
        return res.json();
      })
      .then((data) => {
        const mapped: VerificationResult = {
          url: data.source_url || "",
          title: data.title,
          publisher: data.category ? `Kategori: ${data.category}` : "Katalog Berita Hoaks",
          publishedDate: data.published_date || data.created_at,
          articleHash: data.article_hash,
          credibilityScore: data.credibility_score ?? 0,
          status: data.status || "HOAX",
          isNews: true,
          narasi: data.narasi,
          penjelasan: data.penjelasan,
          kesimpulan: data.kesimpulan,
          summary: data.penjelasan,
          keyFindings: data.key_findings || [],
          claimsReview: data.claims_review || [],
          ipfsCid: data.ipfs_cid || "QmSnapshotUnavailable",
          txHash: data.tx_hash,
          network: "Ethereum Sepolia",
          timestamp: data.created_at,
        };
        setArticle(mapped);
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat artikel hoaks.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
            ID: {id?.substring(0, 8)}...
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Loader2 className="h-8 w-8 animate-spin text-[#185adb] dark:text-blue-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Memuat Laporan Cek Fakta dari Supabase...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 sm:p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
            <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Artikel Tidak Ditemukan
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
              {error}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 inline-flex items-center rounded-lg bg-[#185adb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        )}

        {/* Success Populated Result State */}
        {!isLoading && article && (
          <ResultCard data={article} />
        )}
      </div>
    </div>
  );
}

export default function HoaxDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
          <Loader2 className="h-8 w-8 animate-spin text-[#185adb]" />
        </div>
      }
    >
      <HoaxDetailContent />
    </Suspense>
  );
}
