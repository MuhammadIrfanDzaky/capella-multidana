import type { ReactNode } from "react";

import { APPLICATION_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupiah } from "@/lib/format";
import type { ApplicationDetail } from "@/server/queries/applications";

import { StatusBadge } from "./StatusBadge";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-slate-600 sm:text-base">{label}</dt>
      <dd className="font-medium text-slate-900 sm:col-span-2">{children}</dd>
    </div>
  );
}

export function ApplicationSummary({
  application,
}: {
  application: ApplicationDetail;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
        Data Pengajuan
      </h2>

      <dl className="divide-y divide-slate-100">
        <Row label="NIK">
          <span className="tabular-nums">{application.nik}</span>
        </Row>
        <Row label="Nama Lengkap Nasabah">{application.customerName}</Row>
        <Row label="Tipe Pengajuan">
          {APPLICATION_TYPE_LABELS[application.type]}
        </Row>
        <Row label="Nominal Pengajuan">
          <span className="tabular-nums">
            {formatRupiah(application.amount)}
          </span>
        </Row>
        <Row label="Tenor">{application.tenorMonths} bulan</Row>
        <Row label="Pendapatan Bulanan Nasabah">
          <span className="tabular-nums">
            {formatRupiah(application.monthlyIncome)}
          </span>
        </Row>
        <Row label="Tanggal Pengajuan">
          {formatDate(application.createdAt)}
        </Row>
        <Row label="Status">
          <StatusBadge status={application.status} />
        </Row>
        {application.decidedAt ? (
          <Row label="Tanggal Keputusan">
            {formatDate(application.decidedAt)}
          </Row>
        ) : null}
        <Row label="Catatan">
          {application.notes ?? (
            <span className="font-normal text-slate-500">Tidak ada catatan.</span>
          )}
        </Row>
      </dl>
    </section>
  );
}
