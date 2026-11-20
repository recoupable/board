"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type { ReactNode } from "react";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

/**
 * Privy for the board, set up as Music Nerd's web app sets it up: email
 * login only, and no embedded wallet. Uses Recoup's Privy app, the same one
 * the Recoup API verifies tokens for.
 */
export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    return <p style={{ padding: 24 }}>Sign-in isn&apos;t configured: NEXT_PUBLIC_PRIVY_APP_ID is missing.</p>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: { theme: "light", accentColor: "#087BAB" },
        loginMethods: ["email"],
        embeddedWallets: { ethereum: { createOnLogin: "off" } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
