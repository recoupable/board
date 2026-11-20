import { describe, expect, it } from "vitest";
import { getSafeNextPath } from "@/lib/auth/getSafeNextPath";

describe("getSafeNextPath", () => {
  it("keeps a path on the board", () => {
    expect(getSafeNextPath("/board/general")).toBe("/board/general");
  });

  it.each([null, "", "https://evil.test/board", "//evil.test/board", "/sign-in", "/boardx"])(
    "falls back to /board for %s",
    value => {
      expect(getSafeNextPath(value)).toBe("/board");
    },
  );
});
