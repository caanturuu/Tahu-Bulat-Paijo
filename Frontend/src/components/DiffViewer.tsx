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
    <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Terdeteksi Revisi Konten Artikel
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                MODIFIED
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              Artikel ini telah mengalami perubahan redaksi sejak verifikasi pertama dicatat.
            </p>
          </div>
        </div>

        {/* Word change stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-400 border border-emerald-500/20 font-mono">
            <PlusCircle className="h-3 w-3" />+{addedWords} kata
          </span>
          <span className="flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-rose-400 border border-rose-500/20 font-mono">
            <MinusCircle className="h-3 w-3" />-{removedWords} kata
          </span>
        </div>
      </div>

      {/* Visual Diff Box */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-zinc-400">
          <History className="h-3.5 w-3.5 text-zinc-500" />
          <span>
            Perbandingan Visual: <span className="text-rose-400 line-through">merah</span> = teks awal dihapus, <span className="text-emerald-400 underline">hijau</span> = teks baru ditambahkan.
          </span>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs font-sans leading-relaxed text-zinc-300">
          {diffHtml ? (
            <div
              className="prose prose-invert max-w-none [&_del]:bg-rose-500/20 [&_del]:text-rose-300 [&_del]:px-1 [&_del]:py-0.5 [&_del]:rounded [&_ins]:bg-emerald-500/20 [&_ins]:text-emerald-300 [&_ins]:px-1 [&_ins]:py-0.5 [&_ins]:rounded [&_ins]:no-underline"
              dangerouslySetInnerHTML={{ __html: diffHtml }}
            />
          ) : (
            <p className="italic text-zinc-500">
              Perbedaan kata telah terdeteksi pada hash artikel. Jalankan sinkronisasi diff lengkap untuk melihat detail kata per kata.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
