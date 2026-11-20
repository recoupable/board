"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { buildBoardTokenCookie } from "@/lib/auth/buildBoardTokenCookie";
import { getSafeNextPath } from "@/lib/auth/getSafeNextPath";

/**
 * Signs the visitor in with Privy, then hands the board its access token as
 * a cookie and returns to the board.
 */
export function SignIn() {
  const { ready, authenticated, login, logout, getAccessToken, user } = usePrivy();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("switch")) return;

    getAccessToken()
      .then(token => {
        if (!token) throw new Error("No access token");
        document.cookie = buildBoardTokenCookie(token);
        window.location.replace(getSafeNextPath(params.get("next")));
      })
      .catch(() => setError("Couldn't get your sign-in token. Try signing in again."));
  }, [ready, authenticated, getAccessToken]);

  const signOut = async () => {
    document.cookie = buildBoardTokenCookie(null);
    await logout();
    window.location.replace("/sign-in");
  };

  return (
    <main style={{ maxWidth: 360, margin: "15vh auto", padding: "0 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: 22 }}>Recoup Board</h1>
      {!ready && <p>Loading…</p>}
      {ready && !authenticated && (
        <button type="button" onClick={login} style={{ padding: "10px 18px", fontSize: 16 }}>
          Sign in with email
        </button>
      )}
      {ready && authenticated && (
        <>
          <p>Signed in{user?.email?.address ? ` as ${user.email.address}` : ""}.</p>
          <button type="button" onClick={signOut} style={{ padding: "8px 14px" }}>
            Sign out
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
