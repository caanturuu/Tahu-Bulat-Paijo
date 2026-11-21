"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Database, Link2 } from "lucide-react";
import { shortenHash } from "@/lib/utils";

interface ProofBadgeProps {
  articleHash: string;
  ipfsCid: string;
  txHash?: string;
  timestamp: string;
}

export function ProofBadge({
  articleHash,
  ipfsCid,
  txHash,
  timestamp,
}: ProofBadgeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-800 dark:text-zinc-200 uppercase">
          <Database className="h-4 w-4 text-[#185adb] dark:text-blue-400" strokeWidth={1.75} />
          Bukti Kriptografis & On-Chain (Ethereum Sepolia)
        </h4>
        <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
          {new Date(timestamp).toLocaleDateString("id-ID")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* SHA-256 Hash */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">
            SHA-256 Article Hash
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-medium">
              {shortenHash(articleHash, 6)}
            </span>
            <button
              onClick={() => handleCopy("hash", articleHash)}
              className="text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white transition-colors"
              title="Salin Hash Lengkap"
            >
              {copiedKey === "hash" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* IPFS CID */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">
            IPFS Snapshot (Pinata)
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-medium">
              {shortenHash(ipfsCid, 6)}
            </span>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
              title="Buka Snapshot di IPFS"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Etherscan Tx */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">
            On-Chain Ledger (Etherscan)
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-[#185adb] dark:text-blue-400 font-medium">
              {txHash ? shortenHash(txHash, 6) : "Gasless Relayed"}
            </span>
            {txHash ? (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
                title="Audit di Sepolia Etherscan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link2 className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
