import type { Metadata } from "next";
import "./globals.css";

import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "CMD Finance — Pengajuan Kredit",
  description:
    "Internal tool untuk mencatat dan memproses pengajuan kredit nasabah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-6 py-8 max-md:pb-28">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
