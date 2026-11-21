"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ShieldCheck, LogIn, LogOut, Wallet, ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

export function Navbar() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const userAddress = user?.wallet?.address;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-sm shadow-blue-500/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">
                Veritas<span className="text-blue-500">Chain</span>
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/20">
                Base Sepolia
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Decentralized News Verification & Change Tracking
            </p>
          </div>
        </div>

        {/* Right Nav Action */}
        <div className="flex items-center gap-3">
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors md:flex"
          >
            <span>Explorer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {!ready ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-800" />
          ) : authenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200">
                <Wallet className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono">
                  {userAddress ? shortenAddress(userAddress) : "Connected"}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                title="Disconnect Wallet"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
