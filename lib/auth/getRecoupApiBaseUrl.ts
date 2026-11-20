/**
 * The Recoup API that checks who a visitor is: `RECOUP_API_URL` when set,
 * otherwise production's API in production and the test API elsewhere, as
 * Recoup's chat app chooses.
 */
export function getRecoupApiBaseUrl(): string {
  const configured = process.env.RECOUP_API_URL;
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.VERCEL_ENV === "production"
    ? "https://api.recoupable.dev"
    : "https://test-recoup-api.vercel.app";
}
