import { afterEach, describe, expect, it } from "vitest";
import { getRecoupApiBaseUrl } from "@/lib/auth/getRecoupApiBaseUrl";

describe("getRecoupApiBaseUrl", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it("uses the production API in production", () => {
    delete process.env.RECOUP_API_URL;
    process.env.VERCEL_ENV = "production";
    expect(getRecoupApiBaseUrl()).toBe("https://api.recoupable.dev");
  });

  it("uses the test API everywhere else", () => {
    delete process.env.RECOUP_API_URL;
    process.env.VERCEL_ENV = "preview";
    expect(getRecoupApiBaseUrl()).toBe("https://test-recoup-api.vercel.app");
  });

  it("prefers RECOUP_API_URL without a trailing slash", () => {
    process.env.RECOUP_API_URL = "https://example.test/";
    expect(getRecoupApiBaseUrl()).toBe("https://example.test");
  });
});
