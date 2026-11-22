"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Database, Loader2, RotateCcw } from "lucide-react";
import { shortenAddress, shortenHash } from "@/lib/utils";

export const VERITAS_CONTRACT_ADDRESS = "0x72b64614CadDa0ED5d701Db6a670966AED7759d0";

interface ProofBadgeProps {
  articleHash: string;
  ipfsCid: string;
  txHash?: string;
  timestamp: string;
  contractAddress?: string;
  recordId?: number;
  relayStatus?: "relaying" | "success" | "duplicate_skipped" | "failed";
  relayMessage?: string;
  onRetryRelay?: () => void;
}

export function ProofBadge({
  articleHash,
  ipfsCid,
  txHash,
  timestamp,
  contractAddress = VERITAS_CONTRACT_ADDRESS,
  recordId,
  relayStatus,
  relayMessage,
  onRetryRelay,
}: ProofBadgeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const contractUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;
  const txUrl = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-800 dark:text-zinc-200 uppercase">
          <Database className="h-4 w-4 text-[#185adb] dark:text-blue-400" strokeWidth={1.75} />
          Bukti Kriptografis & On-Chain (Ethereum Sepolia)
        </h4>
        <div className="flex items-center gap-3">
          <a
            href={contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#185adb] hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/70 transition-colors"
            title={`Buka Smart Contract VeritasChain (${contractAddress}) di Sepolia Etherscan`}
          >
            <span>Kontrak {shortenAddress(contractAddress, 4)}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
            {new Date(timestamp).toLocaleDateString("id-ID")}
          </span>
        </div>
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
              type="button"
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

        {/* Etherscan Contract & Tx */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">
            On-Chain Ledger (Etherscan)
          </span>
          <div className="mt-1 flex items-center justify-between gap-2">
            {txUrl ? (
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#185adb] hover:underline dark:text-blue-400 font-semibold"
                title="Audit Transaksi di Sepolia Etherscan"
              >
                <span>{shortenHash(txHash, 6)}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : relayStatus === "relaying" ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#185adb] dark:text-blue-400 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span>Mencatat ke Sepolia...</span>
              </span>
            ) : relayStatus === "duplicate_skipped" ? (
              <a
                href={contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-700 hover:underline dark:text-emerald-400 font-semibold"
                title="Sudah tercatat di Smart Contract Sepolia"
              >
                <span>{recordId ? `Record #${recordId} (On-Chain)` : "Tercatat On-Chain"}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              <a
                href={contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#185adb] hover:underline dark:text-blue-400 font-medium"
                title="Buka Kontrak VeritasChain di Sepolia Etherscan"
              >
                <span>Buka Kontrak Sepolia</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            )}

            {relayStatus === "failed" && onRetryRelay && (
              <button
                type="button"
                onClick={onRetryRelay}
                className="inline-flex items-center gap-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-blue-300 hover:text-[#185adb] dark:border-zinc-700 dark:text-zinc-300 cursor-pointer shrink-0"
                title="Kirim ulang catatan verifikasi ke Sepolia"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Ulangi</span>
              </button>
            )}
          </div>

          {relayStatus === "failed" && relayMessage && (
            <p className="mt-1.5 text-[10px] leading-snug text-amber-700 dark:text-amber-400">
              {relayMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
