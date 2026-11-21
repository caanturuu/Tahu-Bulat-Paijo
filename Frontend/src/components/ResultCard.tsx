"use client";

import React, { useState } from "react";
import { VerificationResult } from "@/types";
import { formatDate, shortenHash } from "@/lib/utils";
import { DiffViewer } from "./DiffViewer";

interface ResultCardProps {
  data?: VerificationResult | null;
  notice?: string | null;
  onReset?: () => void;
}

export function ResultCard({ data, notice, onReset }: ResultCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    if (!text || text.includes("0x0000")) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Status Determination for Benar, Hoaks, Meragukan, or Card Kosong
  const isPopulated = Boolean(data);
  const score = data?.credibilityScore ?? 0;
  const ratingText = data?.claimsReview?.[0]?.rating || "";
  const ratingLower = ratingText.toLowerCase();

  const isHoax =
    isPopulated &&
    (score <= 40 ||
      ratingLower.includes("palsu") ||
      ratingLower.includes("salah") ||
      ratingLower.includes("hoaks") ||
      ratingLower.includes("hoax"));

  const isBenar =
    isPopulated &&
    !isHoax &&
    (score >= 71 ||
      ratingLower.includes("benar") ||
      ratingLower.includes("valid") ||
      ratingLower.includes("fakta"));

  const isMeragukan = isPopulated && !isHoax && !isBenar;

  // Visual Styling Mapping matching Image 1
  let statusLabel = "Belum Diuji";
  let statusSub = "Menunggu input berita";
  let statusColor = "text-stone-400";
  let barColor = "bg-stone-300";
  let barWidth = "0%";
  let scoreDisplay = "--";
  let contextText =
    "Masukkan tautan berita, unggah tangkapan layar, atau ketik kata kunci pada bilah pencarian di atas untuk memulai audit fakta.";
  let headerSubtitle =
    notice || "Card kosong: siap menerima kueri atau tautan berita.";

  if (isHoax) {
    statusLabel = "Terindikasi Hoaks";
    statusSub = "Informasi keliru / tidak akurat";
    statusColor = "text-[#be123c]";
    barColor = "bg-[#be123c]";
    barWidth = `${Math.max(score, 14)}%`;
    scoreDisplay = String(score);
    contextText = `Beredar di ${data?.publisher || "media daring publik"}. Diklasifikasikan sebagai konten keliru dan narasi manipulatif.`;
    headerSubtitle =
      notice || "Simulasi: contoh hasil untuk klaim ini, bukan data langsung.";
  } else if (isBenar) {
    statusLabel = "Terverifikasi Benar";
    statusSub = "Fakta akurat & terkonfirmasi";
    statusColor = "text-[#047857]";
    barColor = "bg-[#047857]";
    barWidth = `${Math.max(score, 14)}%`;
    scoreDisplay = String(score);
    contextText = `Dipublikasikan oleh ${data?.publisher || "media terakreditasi"}. Diklasifikasikan sebagai konten faktual dan terverifikasi Dewan Pers.`;
    headerSubtitle =
      notice || "Simulasi: contoh hasil untuk klaim ini, bukan data langsung.";
  } else if (isMeragukan) {
    statusLabel = "Meragukan";
    statusSub = "Perlu verifikasi lebih lanjut";
    statusColor = "text-[#b45309]";
    barColor = "bg-[#b45309]";
    barWidth = `${Math.max(score, 14)}%`;
    scoreDisplay = String(score);
    contextText = `Beredar di ${data?.publisher || "media daring publik"}. Diklasifikasikan sebagai konten berita dan isu publik.`;
    headerSubtitle =
      notice || "Simulasi: contoh hasil untuk klaim ini, bukan data langsung.";
  }

  // 2. Headline and Title
  const titleText = isPopulated
    ? data?.title?.replace(/^["'“]|["'”]$/g, "")
    : "Berita apa yang ingin Anda periksa hari ini?";

  // 3. Published Date
  const publishedDateText = isPopulated
    ? formatDate(data?.publishedDate || data?.timestamp)
    : "--";

  // 4. On-Chain Metadata
  const networkName = isPopulated ? data?.network || "Base L2" : "Base L2";
  const onChainDate = isPopulated && data?.timestamp
    ? new Date(data.timestamp).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "21/11/2026";

  const rawHash = data?.articleHash || "0x0000000000000000000000000000000000000000";
  const rawIpfs = data?.ipfsCid || "Qm000000000000000000000000000000000000000000";
  const rawTx = data?.txHash || "";

  const displayHash = isPopulated ? shortenHash(rawHash, 6) : "0x0000...0000";
  const displayIpfs = isPopulated ? shortenHash(rawIpfs, 6) : "Qm0000...0000";
  const displayTx = isPopulated && rawTx ? shortenHash(rawTx, 6) : "";

  // 5. Analysis Points (01, 02, 03)
  const defaultFindings = [
    {
      num: "01",
      title: "Status",
      desc: "Terdeteksi sebagai perbincangan kebijakan publik dan isu berita nasional.",
    },
    {
      num: "02",
      title: "Konteks faktual",
      desc: "Ada wacana kebijakan terkait, tetapi petunjuk teknis pelaksanaannya belum diresmikan dalam lembaran negara.",
    },
    {
      num: "03",
      title: "Himbauan",
      desc: "Tunggu pengumuman resmi. Jangan terburu-buru menyimpulkan kabar yang belum final.",
    },
  ];

  const emptyFindings = [
    {
      num: "01",
      title: "Status validasi",
      desc: "Pemeriksaan rilis resmi dari kementerian, lembaga pemerintah, atau instansi terkait.",
    },
    {
      num: "02",
      title: "Konteks faktual",
      desc: "Pencocokan data anggaran, statistik resmi (BPS / APBN), atau dokumen regulasi negara.",
    },
    {
      num: "03",
      title: "Himbauan literasi",
      desc: "Pencegahan penyebaran disinformasi, audio deepfake, dan tangkapan layar editan.",
    },
  ];

  let displayFindings = emptyFindings;

  if (isPopulated) {
    if (data?.keyFindings && data.keyFindings.length > 0) {
      displayFindings = data.keyFindings.slice(0, 3).map((item, idx) => {
        const num = String(idx + 1).padStart(2, "0");
        if (item.includes(":")) {
          const parts = item.split(":");
          return {
            num,
            title: parts[0].trim(),
            desc: parts.slice(1).join(":").trim(),
          };
        }
        const fallbackTitles = ["Status", "Konteks faktual", "Himbauan"];
        return {
          num,
          title: fallbackTitles[idx] || `Poin Analisis #${idx + 1}`,
          desc: item.trim(),
        };
      });
    } else {
      displayFindings = defaultFindings;
    }
  }

  // 6. Claims Review / Sumber Pemeriksa
  const primaryClaim = data?.claimsReview?.[0];
  const reviewPublisher = primaryClaim?.reviewPublisher || (isPopulated ? "Tempo Cek Fakta" : "Konsorsium Cek Fakta IFCN");
  const reviewRating = primaryClaim?.rating || (isPopulated ? (isBenar ? "Fakta Valid / Terkonfirmasi" : isHoax ? "Salah / Hoaks Pabrikasi" : "Sebagian benar / belum final") : "Menunggu pemindaian konsorsium");
  const reviewUrl = primaryClaim?.reviewUrl || (isPopulated ? "https://cekfakta.tempo.co" : "");

  return (
    <div className="w-full rounded-2xl border border-[#e7e4dc] bg-[#faf8f5] p-6 sm:p-10 text-stone-900 shadow-xs transition-all duration-300">
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-[#e7e4dc] pb-4 mb-7 sm:mb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            Pemeriksaan Fakta
          </h3>
          <span className="text-xs text-stone-500 font-normal">
            {headerSubtitle}
          </span>
        </div>

        {onReset && isPopulated ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer underline-offset-2 hover:underline shrink-0 self-start sm:self-auto font-medium"
          >
            ← Kembali ke kartu kosong
          </button>
        ) : (
          <span className="text-xs text-stone-400 font-medium shrink-0 self-start sm:self-auto">
            Siap memverifikasi
          </span>
        )}
      </div>

      {/* ================= SECTION: KLAIM YANG DIPERIKSA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 sm:mb-10">
        {/* Left Column: Klaim Title & Context */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium">
            KLAIM YANG DIPERIKSA
          </div>

          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 tracking-tight leading-[1.18] break-words ${
              !isPopulated ? "text-stone-400 italic font-normal" : ""
            }`}
          >
            “{titleText}”
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl pt-1">
            {contextText}
          </p>

          {data?.url && (
            <div className="pt-1">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 break-all"
              >
                <span>{data.url}</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Skor Kredibilitas */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-start pt-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium">
            SKOR KREDIBILITAS
          </div>

          <div className="my-1.5 flex items-baseline">
            <span
              className={`text-5xl sm:text-6xl font-light font-serif tracking-tight leading-none ${
                isPopulated ? "text-stone-900" : "text-stone-300"
              }`}
            >
              {scoreDisplay}
            </span>
            <span className="text-sm sm:text-base font-normal font-sans text-stone-500 ml-1">
              /100
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full max-w-[220px] bg-stone-200/90 rounded-full h-1.5 overflow-hidden my-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: barWidth }}
            />
          </div>

          {/* Status Label (Meragukan, Terindikasi Hoaks, Terverifikasi Benar, Belum Diuji) */}
          <div className={`font-bold text-base sm:text-lg leading-tight mt-1 ${statusColor}`}>
            {statusLabel}
          </div>

          <div className="text-xs text-stone-600 mt-0.5">
            {statusSub}
          </div>

          <div className="text-xs text-stone-500 mt-4 font-mono sm:font-sans">
            Dipublikasikan {publishedDateText}
          </div>
        </div>
      </div>

      {/* ================= SECTION: ANALISIS ================= */}
      <div className="border-t border-[#e7e4dc] pt-6 sm:pt-8 my-6 sm:my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Section Label Left Column */}
          <div className="lg:col-span-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium">
              ANALISIS
            </span>
          </div>

          {/* Analysis Content Right Column */}
          <div className="lg:col-span-9 space-y-6">
            <p
              className={`font-serif text-base sm:text-lg leading-relaxed ${
                isPopulated ? "text-stone-800" : "text-stone-400 italic"
              }`}
            >
              {isPopulated
                ? data?.summary
                : "Hasil penalaran semantik mendalam mengenai keabsahan rilis kementerian, kebenaran narasi, dan konsensus pemeriksa fakta akan dipaparkan di sini."}
            </p>

            {/* Numbered Points (01, 02, 03) */}
            <div className="border-t border-[#e7e4dc]/70 pt-5 space-y-4">
              {displayFindings.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="font-mono text-xs text-stone-400 font-medium w-6 shrink-0 pt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION: SUMBER PEMERIKSA ================= */}
      <div className="border-t border-[#e7e4dc] pt-6 sm:pt-8 my-6 sm:my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Section Label Left Column */}
          <div className="lg:col-span-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium">
              SUMBER PEMERIKSA
            </span>
          </div>

          {/* Publisher & Rating Right Column */}
          <div className="lg:col-span-9 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-stone-900">
                {reviewPublisher}
              </h4>
              <div className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Penilaian:{" "}
                <span className="font-semibold text-stone-900">
                  {reviewRating}
                </span>
              </div>
            </div>

            {reviewUrl ? (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-stone-800 hover:text-stone-950 underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 font-medium inline-flex items-center gap-1 shrink-0 transition-colors"
              >
                Baca laporan lengkap ↗
              </a>
            ) : (
              <span className="text-xs sm:text-sm text-stone-400">
                Laporan konsorsium resmi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= SECTION: REVISI KONTEN (DIFF VIEWER) ================= */}
      {data?.hasRevisions && (
        <div className="border-t border-[#e7e4dc] pt-6 sm:pt-8 my-6 sm:my-8">
          <DiffViewer
            addedWords={data.diffSummary?.addedWords}
            removedWords={data.diffSummary?.removedWords}
            diffHtml={data.diffSummary?.diffHtml}
          />
        </div>
      )}

      {/* ================= SECTION: BUKTI ON-CHAIN ================= */}
      <div className="border-t border-[#e7e4dc] pt-6 sm:pt-8 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Section Label Left Column */}
          <div className="lg:col-span-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium block">
              BUKTI ON-CHAIN
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              {networkName}
            </span>
            <span className="text-xs text-stone-400 font-mono block mt-0.5">
              {onChainDate}
            </span>
          </div>

          {/* Proof Values & Buttons Right Column */}
          <div className="lg:col-span-9 space-y-3.5">
            {/* Row 1: Hash artikel (SHA-256) */}
            <div className="flex items-center justify-between gap-4 border-b border-[#e7e4dc]/50 pb-3">
              <div>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Hash artikel (SHA-256)
                </span>
                <span className="font-mono text-xs sm:text-sm text-stone-800 font-medium block mt-0.5">
                  {displayHash}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("hash", rawHash)}
                disabled={!isPopulated}
                className="border border-stone-300 bg-white/90 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white/90 px-3 py-1 text-xs font-mono font-medium text-stone-800 rounded-sm transition-colors shrink-0 cursor-pointer"
              >
                {copiedKey === "hash" ? "Tersalin!" : "Salin"}
              </button>
            </div>

            {/* Row 2: Snapshot IPFS (Pinata) */}
            <div className="flex items-center justify-between gap-4 border-b border-[#e7e4dc]/50 pb-3">
              <div>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Snapshot IPFS (Pinata)
                </span>
                <span className="font-mono text-xs sm:text-sm text-stone-800 font-medium block mt-0.5">
                  {displayIpfs}
                </span>
              </div>
              {isPopulated && rawIpfs && !rawIpfs.includes("0000") ? (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${rawIpfs}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-stone-300 bg-white/90 hover:bg-stone-100 px-3 py-1 text-xs font-mono font-medium text-stone-800 rounded-sm transition-colors inline-block text-center shrink-0"
                >
                  Buka ↗
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="border border-stone-300 bg-white/90 opacity-40 px-3 py-1 text-xs font-mono font-medium text-stone-800 rounded-sm inline-block text-center shrink-0 cursor-not-allowed"
                >
                  Buka ↗
                </button>
              )}
            </div>

            {/* Row 3: Transaksi On-Chain (Base L2) */}
            {displayTx && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block">
                    Ledger On-Chain (Base L2)
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-stone-800 font-medium block mt-0.5">
                    {displayTx}
                  </span>
                </div>
                <a
                  href={`https://sepolia.basescan.org/tx/${rawTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-stone-300 bg-white/90 hover:bg-stone-100 px-3 py-1 text-xs font-mono font-medium text-stone-800 rounded-sm transition-colors inline-block text-center shrink-0"
                >
                  Buka ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
