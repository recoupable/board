import { describe, expect, it } from "vitest";
import { getBoardAccessToken } from "@/lib/auth/getBoardAccessToken";

describe("getBoardAccessToken", () => {
  it("reads the bearer token first", () => {
    const request = new Request("https://board.test/board", {
      headers: { authorization: "Bearer abc", cookie: "recoup_board_token=def" },
    });
    expect(getBoardAccessToken(request)).toBe("abc");
  });

  it("falls back to the board cookie", () => {
    const request = new Request("https://board.test/board", {
      headers: { cookie: "other=1; recoup_board_token=def%2Eghi; x=2" },
    });
    expect(getBoardAccessToken(request)).toBe("def.ghi");
  });

  it("returns null with neither", () => {
    expect(getBoardAccessToken(new Request("https://board.test/board"))).toBeNull();
  });

  it("ignores a non-bearer authorization header", () => {
    const request = new Request("https://board.test/board", {
      headers: { authorization: "Basic abc" },
    });
    expect(getBoardAccessToken(request)).toBeNull();
  });
});
