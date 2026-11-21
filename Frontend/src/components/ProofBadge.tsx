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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
          <Database className="h-4 w-4 text-blue-400" />
          Bukti Kriptografis & On-Chain (Base L2)
        </h4>
        <span className="text-[11px] text-zinc-500 font-mono">
          {new Date(timestamp).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* SHA-256 Hash */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            SHA-256 Article Hash
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-200">
              {shortenHash(articleHash, 6)}
            </span>
            <button
              onClick={() => handleCopy("hash", articleHash)}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Copy Full Hash"
            >
              {copiedKey === "hash" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* IPFS CID */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            IPFS Snapshot (Pinata)
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-200">
              {shortenHash(ipfsCid, 6)}
            </span>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-blue-400 transition-colors"
              title="Buka Snapshot di IPFS"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* BaseScan Tx */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            On-Chain Ledger (BaseScan)
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-xs text-blue-400">
              {txHash ? shortenHash(txHash, 6) : "Gasless Relayed"}
            </span>
            {txHash ? (
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-blue-400 transition-colors"
                title="Audit di BaseScan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link2 className="h-3.5 w-3.5 text-zinc-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
