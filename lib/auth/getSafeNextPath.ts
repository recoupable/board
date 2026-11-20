/**
 * Where to send a visitor after signing in: the path they came from when it
 * is on the board, otherwise the board itself, so the sign-in page never
 * redirects off the site.
 *
 * @param next - The `next` query value.
 * @returns A board path.
 */
export function getSafeNextPath(next: string | null): string {
  if (next && (next === "/board" || next.startsWith("/board/"))) return next;
  return "/board";
}
