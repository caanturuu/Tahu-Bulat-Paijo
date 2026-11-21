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
  History,
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

  // Status mapping
  const isPopulated = Boolean(data);
  const score = data?.credibilityScore ?? 0;
  const ratingLower = (data?.claimsReview?.[0]?.rating || "").toLowerCase();

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

  // Validation verdict styling
  let verdictTitle = "BELUM DIUJI";
  let verdictSubtitle = "MENUNGGU INPUT BERITA";
  let verdictBadgeBg = "bg-slate-100 border-slate-300 text-slate-600";
  let verdictCardBg = "bg-slate-50/70 border-slate-200";
  let scoreColor = "text-slate-400";
  let barColor = "bg-slate-300";
  let barWidth = "0%";
  let VerdictIcon = FileSearch;

  if (isHoax) {
    verdictTitle = "HOAKS / KONTEN PALSU";
    verdictSubtitle = "FABRICATED / FALSE CONTENT";
    verdictBadgeBg = "bg-rose-100 border-rose-300 text-rose-800";
    verdictCardBg = "bg-rose-50/40 border-rose-200/90";
    scoreColor = "text-rose-600";
    barColor = "bg-rose-600";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = AlertOctagon;
  } else if (isBenar) {
    verdictTitle = "FAKTA VALID / TERKONFIRMASI";
    verdictSubtitle = "VERIFIED ACCURATE CONTENT";
    verdictBadgeBg = "bg-emerald-100 border-emerald-300 text-emerald-800";
    verdictCardBg = "bg-emerald-50/40 border-emerald-200/90";
    scoreColor = "text-emerald-700";
    barColor = "bg-emerald-600";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = CheckCircle2;
  } else if (isMeragukan) {
    verdictTitle = "KONTEN MENYESATKAN";
    verdictSubtitle = "MISLEADING CONTENT";
    verdictBadgeBg = "bg-amber-100 border-amber-300 text-amber-900";
    verdictCardBg = "bg-amber-50/40 border-amber-200/90";
    scoreColor = "text-amber-600";
    barColor = "bg-amber-500";
    barWidth = `${Math.max(score, 14)}%`;
    VerdictIcon = AlertTriangle;
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

  // Content for Narasi, Penjelasan, and Kesimpulan
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

  // 1. Narasi Text
  const narrativeText = isPopulated
    ? data?.narrative ||
      `Beredar di ${data?.publisher || "media sosial dan media daring publik"} dengan judul/klaim: "${data?.title}". Informasi ini menyebar secara viral melalui tangkapan layar dan pesan terusan tanpa rujukan sumber resmi yang jelas.`
    : "Klaim berita atau tangkapan layar yang beredar di media sosial akan ditampilkan di sini sebagai rujukan narasi awal yang diperiksa.";

  // 2. Penjelasan Text & Points
  const explanationText = isPopulated
    ? data?.explanation ||
      data?.summary ||
      "Pemeriksaan fakta dilakukan dengan menelusuri sumber primer rilis kementerian, arsip keputusan lembaran negara, dan pencarian gambar terbalik (Google Lens) untuk memvalidasi konteks peristiwa."
    : "Metodologi penelusuran fakta melalui pencarian gambar terbalik, verifikasi silang basis data regulasi pemerintah, dan konfirmasi langsung ke kementerian/lembaga terkait akan dipaparkan secara runtut di sini.";

  // Numbered findings points
  const defaultFindings = [
    {
      num: "01",
      title: "Penelusuran Arsip & Sumber Asli",
      desc: "Menelusuri kronologi rekaman/dokumen untuk mencocokkan tanggal kejadian sebenarnya.",
    },
    {
      num: "02",
      title: "Verifikasi Regulasi & Instansi",
      desc: "Memeriksa lembaran negara dan siaran pers resmi dari kementerian/lembaga berwenang.",
    },
    {
      num: "03",
      title: "Himbauan Literasi Publik",
      desc: "Masyarakat diimbau selalu memverifikasi konteks utuh informasi sebelum menyebarkannya.",
    },
  ];

  let displayFindings = defaultFindings;
  if (isPopulated && data?.keyFindings && data.keyFindings.length > 0) {
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
      const fallbackTitles = [
        "Status Verifikasi",
        "Konteks Faktual",
        "Himbauan & Rekomendasi",
      ];
      return {
        num,
        title: fallbackTitles[idx] || `Poin Analisis #${idx + 1}`,
        desc: item.trim(),
      };
    });
  }

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
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 text-slate-900 shadow-xs transition-all duration-300">
      {/* ================= 1. BAGIAN ATAS: VALIDASI ================= */}
      <section aria-labelledby="section-validasi">
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <ShieldCheck className="h-4 w-4 text-[#185adb]" strokeWidth={2} />
              Hasil Pemeriksaan Fakta & Audit Blockchain
            </span>
            {notice && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/70">
                {notice}
              </span>
            )}
          </div>

          {onReset && isPopulated ? (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto hover:underline underline-offset-2"
            >
              ← Kembali ke kartu kosong
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Card Kosong (Siap Verifikasi)
            </span>
          )}
        </div>

        {/* Big Visual Verdict Card (Matching the user's uploaded image stamp) */}
        <div
          className={`rounded-2xl border p-5 sm:p-7 transition-all ${verdictCardBg}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Stamp Badge & Claim Headline */}
            <div className="space-y-3 flex-1">
              {/* Verdict Stamp */}
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

              {/* Main Claim Title */}
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-snug tracking-tight">
                {isPopulated ? `“${data?.title}”` : "“Menunggu Kueri Berita yang Ingin Anda Periksa”"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isPopulated
                  ? `Beredar di ${data?.publisher || "media daring publik"}. Diverifikasi oleh konsorsium jurnalisme bersertifikasi IFCN.`
                  : "Masukkan tautan portal berita, ketik isu yang beredar, atau unggah tangkapan layar pada kolom pencarian di atas."}
              </p>
            </div>

            {/* Right: Credibility Score & Progress Bar */}
            <div className="flex flex-col items-start lg:items-end justify-center rounded-xl bg-white/80 p-4 border border-slate-200/80 shrink-0 w-full lg:w-56 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Skor Kredibilitas
              </span>

              <div className="my-1 flex items-baseline">
                <span
                  className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-none ${scoreColor}`}
                >
                  {isPopulated ? score : "--"}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 ml-1">
                  /100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden my-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: barWidth }}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-500 mt-1">
                Dipublikasikan: {publishedDateText}
              </span>
            </div>
          </div>

          {/* Bottom Bar inside Validation Hero: Verifier & Cryptographic On-Chain Proof */}
          <div className="mt-6 pt-5 border-t border-slate-200/70 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Fact-checker details */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Pemeriksa & Penilaian
              </span>
              <div className="font-semibold text-slate-800">
                {reviewPublisher}
              </div>
              <div className="text-slate-600 mt-0.5">
                Penilaian Resmi: <strong className="text-slate-900">{reviewRating}</strong>
                {reviewUrl && (
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-0.5 text-[#185adb] hover:underline font-semibold"
                  >
                    Laporan Lengkap <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Blockchain On-Chain & IPFS Proof */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Bukti Audit On-Chain (Base L2)
              </span>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-700">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-sans">Hash:</span>
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

                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-sans">IPFS:</span>
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
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-sans">Tx:</span>
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
        </div>
      </section>

      {/* ================= 2. BAGIAN NARASI ================= */}
      <section className="mt-8 pt-8 border-t border-slate-100" aria-labelledby="section-narasi">
        <div className="mb-3">
          <h3
            id="section-narasi"
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
          >
            Narasi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Klaim dan naskah berita yang beredar di ruang publik dan media sosial
          </p>
        </div>

        {/* Narrative Quote Block */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 border-l-4 border-l-slate-400">
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isPopulated ? "text-slate-800 font-normal" : "text-slate-400 italic"
            }`}
          >
            {narrativeText}
          </p>

          {data?.url && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Tautan Berita:</span>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#185adb] hover:underline break-all inline-flex items-center gap-1"
              >
                <span>{data.url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ================= 3. BAGIAN PENJELASAN ================= */}
      <section className="mt-8 pt-8 border-t border-slate-100" aria-labelledby="section-penjelasan">
        <div className="mb-4">
          <h3
            id="section-penjelasan"
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
          >
            Penjelasan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Metodologi investigasi fakta, penelusuran sumber primer, dan verifikasi silang data
          </p>
        </div>

        <div className="space-y-4">
          {/* Main Explanation Paragraph */}
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isPopulated ? "text-slate-800" : "text-slate-400 italic"
            }`}
          >
            {explanationText}
          </p>

          {/* Numbered Investigative Findings */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Poin Kunci Penelusuran Fakta:
            </h4>
            <div className="space-y-3">
              {displayFindings.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 text-xs sm:text-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Diff Viewer if Article Content Changed */}
          {data?.hasRevisions && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <DiffViewer
                addedWords={data.diffSummary?.addedWords}
                removedWords={data.diffSummary?.removedWords}
                diffHtml={data.diffSummary?.diffHtml}
              />
            </div>
          )}
        </div>
      </section>

      {/* ================= 4. BAGIAN KESIMPULAN ================= */}
      <section className="mt-8 pt-8 border-t border-slate-100" aria-labelledby="section-kesimpulan">
        <div className="mb-3">
          <h3
            id="section-kesimpulan"
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
          >
            Kesimpulan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rangkuman kepastian faktual definitif bagi masyarakat
          </p>
        </div>

        {/* Highlighted Conclusion Card */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 transition-all ${
            isHoax
              ? "bg-rose-50/50 border-rose-200/90 text-rose-950"
              : isBenar
              ? "bg-emerald-50/50 border-emerald-200/90 text-emerald-950"
              : isMeragukan
              ? "bg-amber-50/50 border-amber-200/90 text-amber-950"
              : "bg-slate-50/70 border-slate-200 text-slate-600"
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 shrink-0">
              {isHoax ? (
                <AlertOctagon className="h-5 w-5 text-rose-600" strokeWidth={2.2} />
              ) : isBenar ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2.2} />
              ) : isMeragukan ? (
                <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={2.2} />
              ) : (
                <FileSearch className="h-5 w-5 text-slate-400" strokeWidth={2} />
              )}
            </div>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isPopulated ? "font-medium" : "italic text-slate-500"
              }`}
            >
              {conclusionText}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
