import type { Metadata } from "next";

import { ApplicationForm } from "@/components/applications/ApplicationForm";

export const metadata: Metadata = {
  title: "Pengajuan Baru — CMD Finance",
};

export default function NewApplicationPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">
          Pengajuan Baru
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Catat pengajuan pembiayaan nasabah.
        </p>
      </header>

      <ApplicationForm />
    </main>
  );
}
