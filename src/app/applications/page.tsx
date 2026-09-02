import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { buttonClassName } from "@/components/ui/Button";
import { getApplications } from "@/server/queries/applications";

export const metadata: Metadata = {
  title: "Daftar Pengajuan — CMD Finance",
};

// Halaman membaca database pada setiap permintaan, sehingga tidak boleh
// dibekukan menjadi halaman statis saat build.
export const dynamic = "force-dynamic";

export default function ApplicationsPage() {
  const applications = getApplications();

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Daftar Pengajuan
          </h1>
          <p className="mt-1 text-slate-600">
            {applications.length} pengajuan tercatat.
          </p>
        </div>

        <Link href="/applications/new" className={buttonClassName()}>
          Ajukan Baru
        </Link>
      </header>

      <ApplicationTable applications={applications} />
    </div>
  );
}
