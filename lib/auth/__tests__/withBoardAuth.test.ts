import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/getAdminStatus", () => ({ getAdminStatus: vi.fn() }));

import { getAdminStatus } from "@/lib/auth/getAdminStatus";
import { withBoardAuth } from "@/lib/auth/withBoardAuth";

describe("withBoardAuth", () => {
  const inner = vi.fn(async () => new Response("board"));
  const handler = withBoardAuth(inner);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects a signed-out visitor to sign-in from the board page", async () => {
    const response = await handler(new Request("https://board.test/board"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://board.test/sign-in?next=%2Fboard");
    expect(inner).not.toHaveBeenCalled();
  });

  it("answers 401 to a signed-out call to the board's routes", async () => {
    const response = await handler(new Request("https://board.test/board/api/messages"));
    expect(response.status).toBe(401);
    expect(inner).not.toHaveBeenCalled();
  });

  it("redirects to sign-in when the token is no longer valid on the page", async () => {
    vi.mocked(getAdminStatus).mockResolvedValue("unauthenticated");
    const response = await handler(
      new Request("https://board.test/board", { headers: { cookie: "recoup_board_token=old" } }),
    );
    expect(response.status).toBe(307);
  });

  it("answers 403 to a signed-in account that is not a Recoup admin", async () => {
    vi.mocked(getAdminStatus).mockResolvedValue("not_admin");
    const response = await handler(
      new Request("https://board.test/board", { headers: { cookie: "recoup_board_token=t" } }),
    );
    expect(response.status).toBe(403);
    expect(inner).not.toHaveBeenCalled();
  });

  it("serves the board to a Recoup admin", async () => {
    vi.mocked(getAdminStatus).mockResolvedValue("admin");
    const request = new Request("https://board.test/board/api/messages", {
      headers: { authorization: "Bearer t" },
    });
    const response = await handler(request);
    expect(getAdminStatus).toHaveBeenCalledWith("t");
    expect(inner).toHaveBeenCalledWith(request);
    expect(await response.text()).toBe("board");
  });

  it("answers 503 without serving the board when the check fails", async () => {
    vi.mocked(getAdminStatus).mockRejectedValue(new Error("down"));
    const response = await handler(
      new Request("https://board.test/board", { headers: { cookie: "recoup_board_token=t" } }),
    );
    expect(response.status).toBe(503);
    expect(inner).not.toHaveBeenCalled();
  });
});
