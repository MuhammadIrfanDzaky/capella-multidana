import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PAGE_TITLE_CLASS } from "@/components/ui/typography";
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
          <h1 className={PAGE_TITLE_CLASS}>Daftar Pengajuan</h1>
          <p className="mt-1 text-slate-600">
            {applications.length} pengajuan tercatat.
          </p>
        </div>

        <Link href="/applications/new" className={buttonClassName()}>
          Ajukan Baru
        </Link>
      </header>

      {applications.length > 0 ? (
        <ApplicationTable applications={applications} />
      ) : (
        <EmptyState
          title="Belum ada pengajuan"
          description="Pengajuan yang dicatat akan muncul di sini beserta status dan tagihan bulanannya."
          action={
            <Link href="/applications/new" className={buttonClassName()}>
              Catat Pengajuan Pertama
            </Link>
          }
        />
      )}
    </div>
  );
}
