import type { Metadata } from "next";

import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Card } from "@/components/ui/Card";
import { PAGE_TITLE_CLASS } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Pengajuan Baru — CMD Finance",
};

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className={PAGE_TITLE_CLASS}>Pengajuan Baru</h1>
        <p className="mt-1 text-slate-600">
          Catat pengajuan pembiayaan nasabah.
        </p>
      </header>

      <Card className="p-6">
        <ApplicationForm />
      </Card>
    </div>
  );
}
