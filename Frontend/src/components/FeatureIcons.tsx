import React from "react";

/**
 * 1. Konsorsium Cek Fakta Resmi
 * Stylized 3D Dual-Facet Security Shield with consensus nodes and verified checkmark.
 */
export function ConsortiumFactCheckIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGradLeft" x1="10" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="shieldGradRight" x1="24" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="shieldInnerGrad" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="checkGrad" x1="16" y1="24" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F9FF" />
        </linearGradient>
      </defs>

      {/* Ambient Radial Soft Glow */}
      <circle cx="24" cy="24" r="18" fill="#3B82F6" opacity="0.15" />

      {/* Left Shield Half (Lighter facet for 3D depth) */}
      <path
        d="M24 6.5C18.5 8.5 12 8 10 9C10 21 15 35 24 41.5V6.5Z"
        fill="url(#shieldGradLeft)"
      />

      {/* Right Shield Half (Darker facet) */}
      <path
        d="M24 6.5C29.5 8.5 36 8 38 9C38 21 33 35 24 41.5V6.5Z"
        fill="url(#shieldGradRight)"
      />

      {/* Shield Outline Highlight */}
      <path
        d="M24 6.5C29.5 8.5 36 8 38 9C38 21 33 35 24 41.5C15 35 10 21 10 9C12 8 18.5 8.5 24 6.5Z"
        stroke="#93C5FD"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Inner Translucent Crest */}
      <path
        d="M24 11C27.8 12.4 32 12.1 33.5 12.8C33.5 21.5 29.8 31.8 24 36.8C18.2 31.8 14.5 21.5 14.5 12.8C16 12.1 20.2 12.4 24 11Z"
        fill="url(#shieldInnerGrad)"
        opacity="0.35"
      />

      {/* Verification Checkmark */}
      <path
        d="M17.5 24.5L22 29L30.5 19.5"
        stroke="url(#checkGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Floating Consensus Sparkles & Nodes */}
      <circle cx="8" cy="20" r="1.5" fill="#38BDF8" />
      <circle cx="40" cy="18" r="1.5" fill="#60A5FA" />
      <circle cx="34" cy="36" r="1.5" fill="#38BDF8" opacity="0.8" />
      <path
        d="M38 7L39 9.5L41.5 10.5L39 11.5L38 14L37 11.5L34.5 10.5L37 9.5L38 7Z"
        fill="#38BDF8"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * 2. Audit On-Chain Permanen
 * Isometric 3D Blockchain Blocks with Base L2 verification seal and cryptographic nodes.
 */
export function OnChainAuditIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cubeTop" x1="12" y1="8" x2="36" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="10" y1="20" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="24" y1="20" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="chainRing" x1="15" y1="15" x2="33" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Ambient Radial Soft Glow */}
      <circle cx="24" cy="24" r="18" fill="#10B981" opacity="0.15" />

      {/* Isometric Cube (Blockchain Block) */}
      {/* Top Face */}
      <path
        d="M24 7L39 15.5L24 24L9 15.5L24 7Z"
        fill="url(#cubeTop)"
      />
      {/* Left Face */}
      <path
        d="M9 15.5L24 24V41L9 32.5V15.5Z"
        fill="url(#cubeLeft)"
      />
      {/* Right Face */}
      <path
        d="M24 24L39 15.5V32.5L24 41V24Z"
        fill="url(#cubeRight)"
      />

      {/* Isometric Edges Highlights */}
      <path
        d="M24 7L39 15.5L24 24L9 15.5L24 7Z"
        stroke="#A7F3D0"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M24 24V41"
        stroke="#047857"
        strokeWidth="1.2"
      />
      <path
        d="M9 15.5L24 24L39 15.5"
        stroke="#A7F3D0"
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* Cryptographic Node Circuit on faces */}
      <circle cx="16.5" cy="29" r="1.5" fill="#A7F3D0" />
      <line x1="16.5" y1="29" x2="20" y2="33.5" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <circle cx="31.5" cy="29" r="1.5" fill="#6EE7B7" />
      <line x1="31.5" y1="29" x2="28" y2="33.5" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* Central Floating Verified Badge (Base L2 Stamp) */}
      <circle cx="24" cy="23.5" r="9.5" fill="#FFFFFF" />
      <circle cx="24" cy="23.5" r="8" fill="url(#chainRing)" />
      <path
        d="M20.5 23.5L23 26L28 20.5"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle / Finality Star */}
      <path
        d="M10 9L11 11.5L13.5 12.5L11 13.5L10 16L9 13.5L6.5 12.5L9 11.5L10 9Z"
        fill="#34D399"
        opacity="0.9"
      />
      <circle cx="40" cy="35" r="1.5" fill="#06B6D4" />
    </svg>
  );
}

/**
 * 3. Deteksi Revisi Diam-Diam
 * Dynamic Orbital History Arc with Dual-Document Visual Diff Viewer & Timestamp.
 */
export function RevisionDiffIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="orbitGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="docFrontGrad" x1="16" y1="12" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFBEB" />
        </linearGradient>
      </defs>

      {/* Ambient Radial Soft Glow */}
      <circle cx="24" cy="24" r="18" fill="#F59E0B" opacity="0.15" />

      {/* Back Layer Document (Original Version - Ghosted) */}
      <rect
        x="12"
        y="11"
        width="18"
        height="24"
        rx="3.5"
        fill="#FDE68A"
        transform="rotate(-8 12 11)"
        opacity="0.75"
      />
      {/* Ghost text lines on original */}
      <line x1="13" y1="18" x2="23" y2="16.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="12.5" y1="22" x2="21" y2="20.8" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Front Layer Document (Edited Version - Visual Diff View) */}
      <rect
        x="17"
        y="10"
        width="21"
        height="27"
        rx="4"
        fill="url(#docFrontGrad)"
        stroke="#FCD34D"
        strokeWidth="1.2"
      />

      {/* Diff Indicators inside Document */}
      {/* 1. Unchanged Line */}
      <rect x="21" y="15" width="13" height="2" rx="1" fill="#CBD5E1" />

      {/* 2. Red Line: Deleted / Manipulated Text (Strikethrough / Diff Tag) */}
      <rect x="21" y="19" width="13" height="2.5" rx="1" fill="#FEE2E2" />
      <line x1="22" y1="20.2" x2="32" y2="20.2" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />

      {/* 3. Green Line: Inserted / Stealth Revision Text */}
      <rect x="21" y="24" width="11" height="2.5" rx="1" fill="#DCFCE7" />
      <line x1="22" y1="25.2" x2="30" y2="25.2" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" />

      {/* 4. Normal concluding line */}
      <rect x="21" y="29" width="8" height="2" rx="1" fill="#E2E8F0" />

      {/* Sweeping History / Revision Circular Arc */}
      <path
        d="M38 12.5C41.2 16.5 42.5 22 41 27.5C39 34.5 32.5 39.8 25 40.5C18 41.2 11.2 37.5 7.8 31.5C4.5 25.5 5.5 18 10 13"
        stroke="url(#orbitGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="45 4"
      />

      {/* Circular Arrow Head pointing forward in time */}
      <path
        d="M36 7.5L40 12.5L34.5 14.5"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Floating Clock / Timestamp Badge in bottom-left */}
      <circle cx="12" cy="34" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="12" cy="34" r="1" fill="#D97706" />
      <path
        d="M12 30.5V34L14.5 35.5"
        stroke="#D97706"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Sparkle */}
      <path
        d="M41 33L41.8 34.8L43.5 35.5L41.8 36.2L41 38L40.2 36.2L38.5 35.5L40.2 34.8L41 33Z"
        fill="#F97316"
        opacity="0.8"
      />
    </svg>
  );
}
