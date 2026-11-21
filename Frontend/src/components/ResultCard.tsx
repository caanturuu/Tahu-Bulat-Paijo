"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Link2,
  BookOpen,
  HelpCircle,
  FileText,
} from "lucide-react";
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

  // 1. Strict & unambiguous status determination
  const isPopulated = Boolean(data);
  const score = data?.credibilityScore ?? 0;
  const statusStr = (data?.status || "").toUpperCase();
  const ratingLower = (data?.claimsReview?.[0]?.rating || "").toLowerCase();

  // Hoax check (score <= 40 or explicit hoax keywords)
  const isHoax =
    isPopulated &&
    (statusStr === "HOAX" ||
      score <= 40 ||
      ratingLower.includes("palsu") ||
      ratingLower.includes("hoaks") ||
      ratingLower.includes("hoax") ||
      (ratingLower.includes("salah") && !ratingLower.includes("sebagian")));

  // Questionable / Misleading check (score 41 - 70 or questionable/misleading keywords)
  const isMeragukan =
    isPopulated &&
    !isHoax &&
    (statusStr === "QUESTIONABLE" ||
      (score >= 41 && score <= 70) ||
      ratingLower.includes("menyesatkan") ||
      ratingLower.includes("meragukan") ||
      ratingLower.includes("sebagian") ||
      ratingLower.includes("belum final") ||
      ratingLower.includes("privat") ||
      ratingLower.includes("bukan berita"));

  // Valid / Benar check (score >= 71 or strictly VALID status)
  const isBenar =
    isPopulated &&
    !isHoax &&
    !isMeragukan &&
    (statusStr === "VALID" || score >= 71);

  // Status visual attributes
  let verdictTitle = "BELUM DIUJI";
  let verdictSubtitle = "MENUNGGU INPUT BERITA";
  let verdictBadgeBg = "bg-slate-100 border-slate-300 text-slate-700";
  let scoreColor = "text-slate-400";
  let barColor = "bg-slate-300";
  let barWidth = "0%";
  let VerdictIcon = FileSearch;

  if (isHoax) {
    verdictTitle = "HOAKS / KONTEN PALSU";
    verdictSubtitle = "FABRICATED / FALSE CONTENT";
    verdictBadgeBg = "bg-rose-100 border-rose-300 text-rose-800";
    scoreColor = "text-rose-600";
    barColor = "bg-rose-600";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = AlertOctagon;
  } else if (isMeragukan) {
    verdictTitle = "KONTEN MENYESATKAN";
    verdictSubtitle = "MISLEADING CONTENT";
    verdictBadgeBg = "bg-amber-100 border-amber-300 text-amber-900";
    scoreColor = "text-amber-600";
    barColor = "bg-amber-500";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = AlertTriangle;
  } else if (isBenar) {
    verdictTitle = "FAKTA VALID / TERKONFIRMASI";
    verdictSubtitle = "VERIFIED ACCURATE CONTENT";
    verdictBadgeBg = "bg-emerald-100 border-emerald-300 text-emerald-800";
    scoreColor = "text-emerald-700";
    barColor = "bg-emerald-600";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = CheckCircle2;
  }

  // Published date & on-chain data
  const publishedDateText = isPopulated
    ? formatDate(data?.publishedDate || data?.timestamp)
    : "--";

  const rawHash = data?.articleHash || "0x0000000000000000000000000000000000000000";
  const rawIpfs = data?.ipfsCid || "Qm000000000000000000000000000000000000000000";
  const rawTx = data?.txHash || "";

  const displayHash = isPopulated ? shortenHash(rawHash, 6) : "0x0000...0000";
  const displayIpfs = isPopulated ? shortenHash(rawIpfs, 6) : "Qm0000...0000";
  const displayTx = isPopulated && rawTx ? shortenHash(rawTx, 6) : "";

  // Review & verifier details
  const primaryClaim = data?.claimsReview?.[0];
  const reviewPublisher =
    primaryClaim?.reviewPublisher ||
    (isPopulated ? "Tempo Cek Fakta / MAFINDO" : "Konsorsium Cek Fakta IFCN");
  const reviewRating =
    primaryClaim?.rating ||
    (isPopulated
      ? isBenar
        ? "Fakta Valid / Terkonfirmasi"
        : isHoax
        ? "Salah / Hoaks Pabrikasi"
        : "Sebagian Benar / Konten Menyesatkan"
      : "Menunggu pemindaian konsorsium");
  const reviewUrl = primaryClaim?.reviewUrl || "";

  // URL detection helper
  const isRawUrl = (text?: string) =>
    Boolean(text && /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(text.trim()));

  // 1. Narasi Text
  const narrativeText = isPopulated
    ? data?.narrative ||
      `Beredar di ${data?.publisher || "media sosial dan media daring publik"} dengan klaim: "${data?.title}". Informasi ini menyebar secara viral melalui tangkapan layar dan pesan terusan tanpa rujukan sumber resmi yang jelas.`
    : "Klaim berita atau tangkapan layar yang beredar di media sosial akan ditampilkan di sini sebagai rujukan narasi awal yang diperiksa.";

  // 2. Penjelasan Text
  const explanationText = isPopulated
    ? data?.explanation ||
      data?.summary ||
      "Pemeriksaan fakta dilakukan dengan menelusuri sumber primer rilis kementerian, arsip keputusan lembaran negara, dan pencarian gambar terbalik (Google Lens) untuk memvalidasi konteks peristiwa."
    : "Metodologi penelusuran fakta melalui pencarian gambar terbalik, verifikasi silang basis data regulasi pemerintah, dan konfirmasi langsung ke kementerian/lembaga terkait akan dipaparkan secara runtut di sini.";

  // 3. Kesimpulan Text
  const conclusionText = isPopulated
    ? data?.conclusion ||
      `Faktanya, klaim mengenai "${data?.title}" ${
        isHoax
          ? "merupakan KONTEN PALSU (HOAKS). Tidak ada data faktual maupun kebijakan resmi pemerintah yang mendukung narasi tersebut."
          : isBenar
          ? "merupakan FAKTA VALID (TERKONFIRMASI). Informasi ini akurat dan selaras dengan siaran pers serta dokumen regulasi resmi pemerintah."
          : "merupakan KONTEN YANG MENYESATKAN (MISLEADING CONTENT). Narasi yang beredar memuat generalisasi keliru atau menggunakan rekaman di luar konteks aslinya."
      }`
    : "Kesimpulan definitif dari tim pemeriksa fakta akan disajikan di sini untuk memberikan kepastian dan klarifikasi yang mudah dipahami bagi pembaca.";

  return (
    <div className="w-full space-y-6">
      {/* ============================================================== */}
      {/* KARTU 1: VALIDASI (HASIL PEMERIKSAAN FAKTA & SKOR KREDIBILITAS) */}
      {/* ============================================================== */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 shrink-0">
              <ShieldCheck className="h-4 w-4 text-[#185adb]" strokeWidth={2} />
              Hasil Pemeriksaan Fakta & Audit Blockchain
            </span>
            {notice && (
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 border border-blue-200/70 break-words">
                {notice}
              </span>
            )}
          </div>

          {onReset && isPopulated ? (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto hover:underline underline-offset-2 shrink-0"
            >
              ← Kembali ke kartu kosong
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium shrink-0">
              Card Kosong (Siap Verifikasi)
            </span>
          )}
        </div>

        {/* 12-Column Responsive Grid: Kolom Kiri (Stempel & Judul) + Kolom Kanan (Skor Kredibilitas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: 8 Kolom (Stempel & Teks Klaim) */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            {/* Stempel Status Validasi */}
            <div
              className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2 shadow-2xs font-bold ${verdictBadgeBg}`}
            >
              <VerdictIcon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
              <div className="leading-tight">
                <div className="text-xs sm:text-sm font-black tracking-wide uppercase">
                  {verdictTitle}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold opacity-80 uppercase tracking-wider">
                  {verdictSubtitle}
                </div>
              </div>
            </div>

            {/* Judul Berita / Tautan URL yang Diperiksa */}
            {isPopulated ? (
              isRawUrl(data?.title) ? (
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <Link2 className="h-3.5 w-3.5" />
                    Tautan URL yang Diperiksa:
                  </span>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="font-mono text-xs sm:text-sm text-slate-900 break-all select-all font-medium leading-relaxed block">
                      {data?.title}
                    </span>
                  </div>
                </div>
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight break-words">
                  “{data?.title}”
                </h2>
              )
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-slate-400 italic leading-snug tracking-tight">
                “Menunggu Kueri Berita yang Ingin Anda Periksa”
              </h2>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
              {isPopulated
                ? `Beredar di ${data?.publisher || "media daring publik"}. Diverifikasi oleh konsorsium jurnalisme bersertifikasi IFCN.`
                : "Masukkan tautan portal berita, ketik isu yang beredar, atau unggah tangkapan layar pada kolom pencarian di atas."}
            </p>

            {/* Pemeriksa & Penilaian Resmi */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Pemeriksa & Penilaian
                </span>
                <span className="font-bold text-slate-800">{reviewPublisher}</span>
                <span className="text-slate-500 ml-2">
                  Penilaian: <strong className="text-slate-900">{reviewRating}</strong>
                </span>
              </div>
              {reviewUrl && (
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#185adb] hover:underline font-semibold"
                >
                  Laporan Lengkap <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Kolom Kanan: 4 Kolom (Skor Kredibilitas - 100% Terkandung di Dalam Grid) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border p-5 shadow-2xs w-full min-w-0 bg-white">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Skor Kredibilitas
              </span>

              <div className="my-2 flex items-baseline">
                <span
                  className={`text-5xl font-black tracking-tight leading-none ${scoreColor}`}
                >
                  {isPopulated ? score : "--"}
                </span>
                <span className="text-sm font-semibold text-slate-400 ml-1.5">
                  /100
                </span>
              </div>

              {/* Bilah Progres */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden my-2 border border-slate-200/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: barWidth }}
                />
              </div>

              <div className={`text-xs font-bold mt-2 uppercase tracking-wider ${scoreColor}`}>
                {verdictTitle}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Dipublikasikan: {publishedDateText}
            </div>
          </div>
        </div>

        {/* Baris Bawah Card 1: Bukti Audit On-Chain (Base L2) */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Bukti Kriptografis & On-Chain (Base Sepolia L2)
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-slate-700">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="text-slate-400 font-sans font-medium">Hash:</span>
              <span>{displayHash}</span>
              <button
                type="button"
                onClick={() => handleCopy("hash", rawHash)}
                disabled={!isPopulated}
                className="ml-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                title="Salin SHA-256 Hash"
              >
                {copiedKey === "hash" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="text-slate-400 font-sans font-medium">IPFS:</span>
              <span>{displayIpfs}</span>
              {isPopulated && rawIpfs && !rawIpfs.includes("0000") ? (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${rawIpfs}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0.5 text-slate-400 hover:text-[#185adb]"
                  title="Buka Snapshot IPFS"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>

            {displayTx && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <span className="text-slate-400 font-sans font-medium">Tx:</span>
                <span>{displayTx}</span>
                <a
                  href={`https://sepolia.basescan.org/tx/${rawTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0.5 text-slate-400 hover:text-[#185adb]"
                  title="Lihat di BaseScan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* KARTU 2: LAPORAN PEMERIKSAAN FAKTA (NARASI, PENJELASAN, KESIMPULAN) */}
      {/* ============================================================== */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-8">
        {/* BAGIAN 1: NARASI */}
        <section aria-labelledby="section-narasi">
          <div className="mb-3">
            <h3
              id="section-narasi"
              className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4 text-[#185adb]" />
              Narasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klaim dan naskah berita yang beredar di ruang publik dan media sosial
            </p>
          </div>

          {/* Narrative Quote Block (break-words prevents word splitting) */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 border-l-4 border-l-slate-400">
            <p
              className={`text-sm sm:text-base leading-relaxed break-words ${
                isPopulated ? "text-slate-800 font-normal" : "text-slate-400 italic"
              }`}
            >
              {narrativeText}
            </p>

            {data?.url && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-500 break-words">
                <span className="font-semibold text-slate-600 shrink-0">Tautan Berita:</span>
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#185adb] hover:underline break-all inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>{data.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Divider halus antar bagian */}
        <div className="border-t border-slate-100" />

        {/* BAGIAN 2: PENJELASAN (POIN KUNCI BOX TELAH DIHAPUS) */}
        <section aria-labelledby="section-penjelasan">
          <div className="mb-3">
            <h3
              id="section-penjelasan"
              className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-[#185adb]" />
              Penjelasan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Metodologi investigasi fakta, penelusuran sumber primer, dan verifikasi silang data
            </p>
          </div>

          <div className="space-y-4">
            {/* Main Explanation Paragraph (break-words keeps normal words intact) */}
            <p
              className={`text-sm sm:text-base leading-relaxed break-words ${
                isPopulated ? "text-slate-800" : "text-slate-400 italic"
              }`}
            >
              {explanationText}
            </p>

            {/* Visual Diff Viewer if Article Content Changed */}
            {data?.hasRevisions && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <DiffViewer
                  addedWords={data.diffSummary?.addedWords}
                  removedWords={data.diffSummary?.removedWords}
                  diffHtml={data.diffSummary?.diffHtml}
                />
              </div>
            )}
          </div>
        </section>

        {/* Divider halus antar bagian */}
        <div className="border-t border-slate-100" />

        {/* BAGIAN 3: KESIMPULAN */}
        <section aria-labelledby="section-kesimpulan">
          <div className="mb-3">
            <h3
              id="section-kesimpulan"
              className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4 text-[#185adb]" />
              Kesimpulan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rangkuman kepastian faktual definitif bagi masyarakat
            </p>
          </div>

          {/* Highlighted Conclusion Card (break-words keeps normal words intact) */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 transition-all w-full ${
              isHoax
                ? "bg-rose-50/60 border-rose-200 text-rose-950"
                : isMeragukan
                ? "bg-amber-50/60 border-amber-200 text-amber-950"
                : isBenar
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 shrink-0">
                {isHoax ? (
                  <AlertOctagon className="h-5 w-5 text-rose-600" strokeWidth={2.2} />
                ) : isMeragukan ? (
                  <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={2.2} />
                ) : isBenar ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2.2} />
                ) : (
                  <FileSearch className="h-5 w-5 text-slate-400" strokeWidth={2} />
                )}
              </div>

              <p
                className={`text-sm sm:text-base leading-relaxed break-words ${
                  isPopulated ? "font-medium" : "italic text-slate-500"
                }`}
              >
                {conclusionText}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
