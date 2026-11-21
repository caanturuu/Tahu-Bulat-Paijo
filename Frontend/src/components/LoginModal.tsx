"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Wallet,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login } = usePrivy();
  const [email, setEmail] = useState("validator@veritaschain.id");
  const [password, setPassword] = useState("••••••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate credential validation & JWT session creation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeb3Login = () => {
    try {
      if (login) login();
      onClose();
    } catch (err) {
      console.warn("Web3 login:", err);
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    try {
      if (login) login();
      onClose();
    } catch (err) {
      console.warn("Google login:", err);
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[420px] rounded-3xl bg-white p-7 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Shield Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#185adb]">
          <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Masuk ke VeritasChain
        </h2>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Akses audit desentralisasi dan verifikasi klaim berita.
        </p>

        {isSuccess ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce mb-2" />
            <h4 className="font-semibold text-slate-800 text-sm">
              Berhasil Masuk!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Mengalihkan ke dasbor validator...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email atau ID Validator
              </label>
              <div className="relative flex items-center rounded-xl bg-[#f8fafc] border border-slate-200/90 px-3.5 py-2.5 transition-all focus-within:border-[#185adb] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <Mail className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="validator@veritaschain.id"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <div className="relative flex items-center rounded-xl bg-[#f8fafc] border border-slate-200/90 px-3.5 py-2.5 transition-all focus-within:border-[#185adb] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <Lock className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium tracking-wider"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#185adb] focus:ring-[#185adb]"
                />
                <span>Ingat saya</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Tautan reset kata sandi telah dikirimkan ke email Anda.")}
                className="font-medium text-[#185adb] hover:underline"
              >
                Lupa kata sandi?
              </button>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#185adb] py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <span>Masuk ke Akun</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Atau Lanjutkan Dengan
              </span>
            </div>

            {/* Alternative Auth Methods (Web3 & Google) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Web3 Wallet */}
              <button
                type="button"
                onClick={handleWeb3Login}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
              >
                {/* Stylized Key/Wallet Icon */}
                <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                <span className="truncate">Hubungkan Dompet Web3</span>
              </button>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
              >
                {/* Official Google G Logo */}
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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
                <span className="truncate">Masuk dengan Google</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="pt-3 text-center text-xs text-slate-500">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => alert("Registrasi validator publik dibuka selama periode HackSphere 2026.")}
                className="font-semibold text-[#185adb] hover:underline"
              >
                Daftar sekarang
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
