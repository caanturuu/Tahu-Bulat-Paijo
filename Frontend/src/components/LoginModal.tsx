"use client";

import React, { useState } from "react";
import { usePrivy, useLoginWithOAuth } from "@privy-io/react-auth";
import {
  X,
  ShieldCheck,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login } = usePrivy();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const { initOAuth, loading: isOAuthLoading } = useLoginWithOAuth({
    onComplete: () => {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 600);
    },
    onError: (err) => {
      console.warn("Google OAuth fallback:", err);
      try {
        login({ loginMethods: ["google"] });
      } catch (e) {
        console.error(e);
      }
    },
  });

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await initOAuth({ provider: "google" });
    } catch {
      login({ loginMethods: ["google"] });
      onClose();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsEmailLoading(true);
    try {
      login({
        loginMethods: ["email"],
        prefill: { type: "email", value: email.trim() },
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleWeb3Login = () => {
    try {
      login({ loginMethods: ["wallet"] });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[420px] rounded-3xl bg-white p-7 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 dark:bg-zinc-900 dark:border-zinc-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Shield Branding Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#185adb] dark:bg-blue-950/60 dark:text-blue-400 shadow-xs">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Masuk Akun
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Masuk terlebih dahulu agar hasil audit pemeriksaan tercatat
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center animate-in fade-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce mb-2" />
            <h4 className="font-semibold text-slate-800 text-sm dark:text-white">
              Berhasil Masuk!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Dompet Web3 otomatis aktif di latar belakang.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary Action: Official Google Login Button (Full Width, Standard Google Style) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isOAuthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200/90 bg-white py-3.5 px-4 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-70 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {isOAuthLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-[#185adb]" />
                  <span>Membuka Google OAuth...</span>
                </>
              ) : (
                <>
                  {/* Official Google G SVG */}
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Lanjutkan dengan Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
              <span className="absolute bg-white px-3 text-[11px] font-medium text-slate-400 dark:bg-zinc-900 dark:text-zinc-500">
                atau gunakan email
              </span>
            </div>

            {/* Passwordless Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="relative flex items-center rounded-xl bg-[#f8fafc] border border-slate-200 px-3.5 py-2.5 transition-all focus-within:border-[#185adb] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:bg-zinc-800/80 dark:border-zinc-700 dark:focus-within:bg-zinc-800">
                <Mail className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isEmailLoading || !email.trim()}
                className="w-full rounded-xl bg-[#185adb] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isEmailLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Mengirim Kode...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan dengan Email</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Web3 Non-Custodial Security Badge */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500 leading-relaxed dark:bg-zinc-800/50 dark:border-zinc-800 dark:text-zinc-400 flex items-start gap-2">
              <Lock className="h-3.5 w-3.5 text-[#185adb] shrink-0 mt-0.5" />
              <span>
                Dompet Web3 terenkripsi otomatis dibuatkan di latar belakang tanpa instal ekstensi browser atau seed phrase.
              </span>
            </div>

            {/* External Wallet Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleWeb3Login}
                className="text-[11px] font-medium text-slate-500 hover:text-[#185adb] transition-colors underline dark:text-zinc-400"
              >
                Punya dompet MetaMask / Web3 eksternal? Hubungkan di sini
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
