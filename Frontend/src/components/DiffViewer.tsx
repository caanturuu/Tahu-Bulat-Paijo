"use client";

import React from "react";
import { History, AlertTriangle, PlusCircle, MinusCircle } from "lucide-react";

interface DiffViewerProps {
  originalText?: string;
  currentText?: string;
  addedWords?: number;
  removedWords?: number;
  diffHtml?: string;
}

export function DiffViewer({
  addedWords = 0,
  removedWords = 0,
  diffHtml,
}: DiffViewerProps) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-4 sm:p-5 backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-950/15">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200/80 pb-3 dark:border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              Terdeteksi Revisi Konten Artikel
              <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-300">
                DIREVISI
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Artikel ini telah mengalami perubahan redaksi sejak verifikasi pertama dicatat di blockchain.
            </p>
          </div>
        </div>

        {/* Word change stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-emerald-800 border border-emerald-300 font-mono font-semibold dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <PlusCircle className="h-3.5 w-3.5" />+{addedWords} kata
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-rose-100 px-2 py-1 text-rose-800 border border-rose-300 font-mono font-semibold dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
            <MinusCircle className="h-3.5 w-3.5" />-{removedWords} kata
          </span>
        </div>
      </div>

      {/* Visual Diff Box */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-600 dark:text-zinc-400">
          <History className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Perbandingan Visual: <span className="bg-rose-100 text-rose-700 px-1 py-0.5 rounded line-through dark:bg-rose-500/20 dark:text-rose-300">merah</span> = teks awal dihapus, <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded underline dark:bg-emerald-500/20 dark:text-emerald-300">hijau</span> = teks baru ditambahkan.
          </span>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-xs font-sans leading-relaxed text-slate-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {diffHtml ? (
            <div
              className="prose max-w-none [&_del]:bg-rose-100 [&_del]:text-rose-700 [&_del]:px-1 [&_del]:py-0.5 [&_del]:rounded [&_ins]:bg-emerald-100 [&_ins]:text-emerald-700 [&_ins]:px-1 [&_ins]:py-0.5 [&_ins]:rounded [&_ins]:no-underline dark:[&_del]:bg-rose-500/20 dark:[&_del]:text-rose-300 dark:[&_ins]:bg-emerald-500/20 dark:[&_ins]:text-emerald-300"
              dangerouslySetInnerHTML={{ __html: diffHtml }}
            />
          ) : (
            <p className="italic text-slate-400">
              Perbedaan kata telah terdeteksi pada hash artikel. Jalankan sinkronisasi diff lengkap untuk melihat detail kata per kata.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
