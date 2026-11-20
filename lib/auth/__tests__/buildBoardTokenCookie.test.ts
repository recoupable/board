import { describe, expect, it } from "vitest";
import { buildBoardTokenCookie } from "@/lib/auth/buildBoardTokenCookie";

describe("buildBoardTokenCookie", () => {
  it("sets a secure, same-site cookie for an hour", () => {
    expect(buildBoardTokenCookie("a.b.c")).toBe(
      "recoup_board_token=a.b.c; Path=/; Max-Age=3600; Secure; SameSite=Lax",
    );
  });

  it("clears the cookie", () => {
    expect(buildBoardTokenCookie(null)).toBe(
      "recoup_board_token=; Path=/; Max-Age=0; Secure; SameSite=Lax",
    );
  });
});
