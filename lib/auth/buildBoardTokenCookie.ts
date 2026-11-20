import { BOARD_TOKEN_COOKIE } from "@/lib/auth/boardTokenCookieName";

/**
 * The `document.cookie` value that stores the visitor's Privy access token
 * for the board's routes, or clears it. It lasts an hour, as the token does.
 *
 * @param token - The access token, or null to clear it.
 * @returns The cookie string.
 */
export function buildBoardTokenCookie(token: string | null): string {
  const maxAge = token ? 3600 : 0;
  return `${BOARD_TOKEN_COOKIE}=${token ? encodeURIComponent(token) : ""}; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`;
}
