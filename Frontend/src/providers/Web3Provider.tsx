"use client";

import React, { useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";

interface Web3ProviderProps {
  children: React.ReactNode;
}

// Fallback dummy Privy App ID for local development and build prerendering
const DEFAULT_PRIVY_APP_ID = "clh1234567890123456789012";

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const privyAppId =
    process.env.NEXT_PUBLIC_PRIVY_APP_ID &&
    process.env.NEXT_PUBLIC_PRIVY_APP_ID.length > 10
      ? process.env.NEXT_PUBLIC_PRIVY_APP_ID
      : DEFAULT_PRIVY_APP_ID;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#2563eb",
          logo: "/globe.svg",
        },
        loginMethods: ["google", "email"],
        defaultChain: sepolia,
        supportedChains: [sepolia],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </PrivyProvider>
  );
}
