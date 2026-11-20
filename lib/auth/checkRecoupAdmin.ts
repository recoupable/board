import { getRecoupApiBaseUrl } from "@/lib/auth/getRecoupApiBaseUrl";

export type AdminStatus = "admin" | "not_admin" | "unauthenticated";

/**
 * Asks the Recoup API whether a Privy access token belongs to a Recoup
 * admin, through `GET /api/admins`, which verifies the token and checks the
 * account's admin flag. Any answer other than a clear yes, no or 401 throws,
 * so a failure never lets anyone in.
 *
 * @param token - The visitor's Privy access token.
 * @returns Whether the account is an admin, or that the token was refused.
 */
export async function checkRecoupAdmin(token: string): Promise<AdminStatus> {
  const response = await fetch(`${getRecoupApiBaseUrl()}/api/admins`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 401) return "unauthenticated";
  if (!response.ok) throw new Error(`Admin check failed with ${response.status}`);

  const body = (await response.json()) as { isAdmin?: unknown };
  return body.isAdmin === true ? "admin" : "not_admin";
}
