import { checkRecoupAdmin, type AdminStatus } from "@/lib/auth/checkRecoupAdmin";

const TTL_MS = 60_000;
const answers = new Map<string, { status: AdminStatus; at: number }>();

/**
 * `checkRecoupAdmin`, remembered for a minute per token, because the board
 * page makes many requests. Failures are not remembered.
 *
 * @param token - The visitor's Privy access token.
 * @returns The token's admin status.
 */
export async function getAdminStatus(token: string): Promise<AdminStatus> {
  const cached = answers.get(token);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.status;

  const status = await checkRecoupAdmin(token);
  answers.set(token, { status, at: Date.now() });
  return status;
}
