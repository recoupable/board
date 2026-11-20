import type { ReactNode } from "react";

export const metadata = { title: "Recoup Board" };

/** Root layout for the board's own pages (sign-in). The board itself is served by its route. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
