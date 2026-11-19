import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Recoup Board", description: "Read-only view of Recoup's Vercel Board." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
