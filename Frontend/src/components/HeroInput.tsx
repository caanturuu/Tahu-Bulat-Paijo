"use client";

import React, { useState } from "react";
import { Search, Link as LinkIcon, FileText, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { VerificationMode } from "@/types";

interface HeroInputProps {
  onVerify: (mode: VerificationMode, content: string) => Promise<void>;
  isLoading: boolean;
}

export function HeroInput({ onVerify, isLoading }: HeroInputProps) {
  const [mode, setMode] = useState<VerificationMode>("url");
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onVerify(mode, inputVal.trim());
  };

  const handlePreset = (presetUrl: string) => {
    setMode("url");
    setInputVal(presetUrl);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl">
      {/* Mode Tabs */}
      <div className="flex border-b border-zinc-800 pb-3 gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
            mode === "url"
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <span>Verifikasi Tautan (URL)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("text")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
            mode === "text"
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Paste Teks Berita</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("rescan")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
            mode === "rescan"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Cek Revisi Diam-diam (Rescan)</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {mode === "text" ? (
          <div>
            <textarea
              rows={4}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tempelkan seluruh teks artikel, judul, atau klaim berita yang ingin Anda verifikasi..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-sans"
              required
            />
          </div>
        ) : (
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 text-zinc-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                mode === "rescan"
                  ? "Masukkan URL artikel yang sudah pernah diaudit untuk mendeteksi revisi teks..."
                  : "https://news.portal.com/artikel-berita-terbaru"
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              required
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          {/* Preset Buttons for Demo */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-[11px] text-zinc-500 mr-1">Coba Demo:</span>
            <button
              type="button"
              onClick={() => handlePreset("https://turnbackhoax.id/contoh-klaim-politik")}
              className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              Demo Hoaks
            </button>
            <button
              type="button"
              onClick={() => handlePreset("https://kompas.com/contoh-berita-nasional-resmi")}
              className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              Demo Berita Valid
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menganalisis Klaim & On-Chain...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>
                  {mode === "rescan" ? "Jalankan Deteksi Revisi" : "Mulai Verifikasi"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
