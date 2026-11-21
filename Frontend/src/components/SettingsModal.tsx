"use client";

import React, { useState } from "react";
import { X, Settings, Cpu, Database, Network, ShieldCheck, Check } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [network, setNetwork] = useState("base-sepolia");
  const [aiModel, setAiModel] = useState("gemini-2.0-flash");
  const [factCheckSource, setFactCheckSource] = useState("google-claimreview");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[460px] rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
          title="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#185adb] dark:bg-blue-950/40 dark:text-blue-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pengaturan Sistem
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Konfigurasi node Web3, AI Engine, dan data audit
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 text-xs">
          {/* Blockchain Network */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-zinc-300">
              <Network className="h-3.5 w-3.5 text-blue-600" />
              Jaringan Ledger Blockchain
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="base-sepolia">Base Sepolia (L2 - Super Cepat & Gasless)</option>
              <option value="ethereum-sepolia">Ethereum Sepolia (L1 Testnet)</option>
            </select>
          </div>

          {/* AI Model Engine */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-zinc-300">
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              Mesin Analisis Semantik AI
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Default - Rekomendasi)</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Reasoning)</option>
            </select>
          </div>

          {/* Fact Check Source */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5 dark:text-zinc-300">
              <Database className="h-3.5 w-3.5 text-amber-600" />
              Sumber Rujukan Klaim
            </label>
            <select
              value={factCheckSource}
              onChange={(e) => setFactCheckSource(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="google-claimreview">
                Google Fact Check API (MAFINDO, Kompas, Tempo, AFP, Tirto)
              </option>
              <option value="turnbackhoax">TurnBackHoax.id Feed Murni</option>
            </select>
          </div>

          {/* Storage Information */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                IPFS Decentralized Storage
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online (Pinata Gateway)</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-[#185adb] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <span>Simpan Pengaturan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
