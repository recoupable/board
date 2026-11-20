import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/checkRecoupAdmin", () => ({ checkRecoupAdmin: vi.fn() }));

import { checkRecoupAdmin } from "@/lib/auth/checkRecoupAdmin";
import { getAdminStatus } from "@/lib/auth/getAdminStatus";

describe("getAdminStatus", () => {
  beforeEach(() => {
    vi.mocked(checkRecoupAdmin).mockReset();
    vi.useRealTimers();
  });

  it("reuses a recent answer for the same token", async () => {
    vi.mocked(checkRecoupAdmin).mockResolvedValue("admin");
    expect(await getAdminStatus("same")).toBe("admin");
    expect(await getAdminStatus("same")).toBe("admin");
    expect(checkRecoupAdmin).toHaveBeenCalledTimes(1);
  });

  it("asks again once the answer is a minute old", async () => {
    vi.useFakeTimers();
    vi.mocked(checkRecoupAdmin).mockResolvedValue("admin");
    await getAdminStatus("aging");
    vi.advanceTimersByTime(61_000);
    await getAdminStatus("aging");
    expect(checkRecoupAdmin).toHaveBeenCalledTimes(2);
  });

  it("does not keep failures", async () => {
    vi.mocked(checkRecoupAdmin).mockRejectedValueOnce(new Error("down"));
    await expect(getAdminStatus("flaky")).rejects.toThrow("down");
    vi.mocked(checkRecoupAdmin).mockResolvedValue("admin");
    expect(await getAdminStatus("flaky")).toBe("admin");
  });
});
