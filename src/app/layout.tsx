import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMD Finance — Pengajuan Kredit",
  description:
    "Internal tool untuk mencatat dan memproses pengajuan kredit nasabah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
