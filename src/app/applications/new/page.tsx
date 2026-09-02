import type { Metadata } from "next";

import { ApplicationForm } from "@/components/applications/ApplicationForm";

export const metadata: Metadata = {
  title: "Pengajuan Baru — CMD Finance",
};

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Pengajuan Baru</h1>
        <p className="mt-1 text-slate-600">
          Catat pengajuan pembiayaan nasabah.
        </p>
      </header>

      <ApplicationForm />
    </div>
  );
}
