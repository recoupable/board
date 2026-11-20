import { BOARD_TOKEN_COOKIE } from "@/lib/auth/boardTokenCookieName";

/**
 * Reads the visitor's Privy access token: an `Authorization: Bearer` header
 * first, then the board cookie, since the board page's own requests can't
 * add a header.
 *
 * @param request - The incoming request.
 * @returns The token, or null when there is none.
 */
export function getBoardAccessToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7).trim() || null;

  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === BOARD_TOKEN_COOKIE) return decodeURIComponent(value.join("=")) || null;
  }
  return null;
}
