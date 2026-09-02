import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationSummary } from "@/components/applications/ApplicationSummary";
import { InstallmentBreakdown } from "@/components/applications/InstallmentBreakdown";
import { getApplicationById } from "@/server/queries/applications";

export const metadata: Metadata = {
  title: "Detail Pengajuan — CMD Finance",
};

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: PageProps<"/applications/[id]">) {
  const { id } = await params;

  // Alamat halaman berasal dari luar, sehingga id diperlakukan sebagai masukan
  // yang belum tentu berupa angka.
  const applicationId = Number(id);

  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    notFound();
  }

  const application = getApplicationById(applicationId);

  if (!application) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/applications"
        className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        &larr; Kembali ke daftar pengajuan
      </Link>

      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pengajuan #{application.id}
        </h1>
        <p className="mt-1 text-slate-600">
          Atas nama {application.customerName}.
        </p>
      </header>

      <div className="space-y-6">
        <ApplicationSummary application={application} />
        <InstallmentBreakdown
          type={application.type}
          amount={application.amount}
          tenorMonths={application.tenorMonths}
        />
      </div>
    </div>
  );
}
