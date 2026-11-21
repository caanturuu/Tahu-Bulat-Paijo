"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  Moon,
  Sun,
  Settings,
  Wallet,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenLogin?: () => void;
  onOpenSettings?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({
  activeTab = "Cek Fakta",
  onTabChange,
  onOpenLogin,
  onOpenSettings,
  isLoggedIn = false,
  userEmail,
  onLogout,
}: NavbarProps) {
  const { authenticated, user, logout: privyLogout } = usePrivy();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Check initial dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const navItems = [
    { id: "cek-fakta", label: "Cek Fakta" },
    { id: "berita-hoaks", label: "Berita Hoaks" },
    { id: "riwayat", label: "Riwayat" },
    { id: "tentang", label: "Tentang" },
  ];

  const handleNavClick = (label: string) => {
    setCurrentTab(label);
    if (onTabChange) onTabChange(label);
    setMobileMenuOpen(false);
  };

  const isUserAuthenticated = authenticated || isLoggedIn;
  const userAddress = user?.wallet?.address;
  const displayIdentity = userAddress
    ? shortenAddress(userAddress)
    : userEmail || "Validator Terverifikasi";

  const handleLogout = () => {
    if (authenticated) {
      try {
        privyLogout();
      } catch (e) {
        console.error(e);
      }
    }
    if (onLogout) onLogout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
          onClick={() => handleNavClick("Cek Fakta")}
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
            {/* Stylized V Logo */}
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 7L13.5 25.5L17.5 19.5L12 7H6Z" fill="#0ea5e9" />
              <path
                d="M13.5 25.5L17.5 29.5L29 7H23L16 21.5L13.5 25.5Z"
                fill="#185adb"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Veritas<span className="font-extrabold text-[#185adb]">Chain</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.label;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.label)}
                className={`relative py-5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#185adb] font-semibold dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#185adb] dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Switch Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs"
            title={isDarkMode ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-semibold text-amber-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-600" />
                <span className="hidden sm:inline text-[11px] font-semibold text-slate-600">Dark</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            title="Pengaturan Jaringan & API"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Masuk / User Status Button */}
          {isUserAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Wallet className="h-3.5 w-3.5 text-[#185adb] dark:text-blue-400 shrink-0" />
                <span className="font-mono text-[10px] sm:text-[11px] truncate max-w-[90px] sm:max-w-none">
                  {displayIdentity}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="rounded-full bg-[#185adb] px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all shrink-0"
            >
              Masuk
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 ml-0.5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-150 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.label)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 font-semibold text-[#185adb] dark:bg-blue-950/40 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#185adb] dark:bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Dark/Light Mode Row */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-3 px-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              Mode {isDarkMode ? "Gelap (Dark)" : "Terang (Light)"}
            </span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? "bg-[#185adb]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#185adb]" />
              Base Sepolia Testnet
            </span>
            <a
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              BaseScan <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
