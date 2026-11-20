import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRecoupAdmin } from "@/lib/auth/checkRecoupAdmin";

describe("checkRecoupAdmin", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    process.env.RECOUP_API_URL = "https://api.test";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    delete process.env.RECOUP_API_URL;
  });

  it("asks GET /api/admins with the Privy token as a bearer", async () => {
    fetchMock.mockResolvedValue(Response.json({ status: "success", isAdmin: true }));
    await checkRecoupAdmin("tok");
    expect(fetchMock).toHaveBeenCalledWith("https://api.test/api/admins", {
      headers: { Authorization: "Bearer tok" },
      cache: "no-store",
    });
  });

  it("returns admin when the API says so", async () => {
    fetchMock.mockResolvedValue(Response.json({ status: "success", isAdmin: true }));
    expect(await checkRecoupAdmin("tok")).toBe("admin");
  });

  it("returns not_admin for a signed-in account without admin", async () => {
    fetchMock.mockResolvedValue(Response.json({ status: "success", isAdmin: false }));
    expect(await checkRecoupAdmin("tok")).toBe("not_admin");
  });

  it("returns unauthenticated when the API rejects the token", async () => {
    fetchMock.mockResolvedValue(Response.json({ status: "error" }, { status: 401 }));
    expect(await checkRecoupAdmin("tok")).toBe("unauthenticated");
  });

  it("throws on any other failure so nobody is let in by mistake", async () => {
    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
    await expect(checkRecoupAdmin("tok")).rejects.toThrow();
  });
});
