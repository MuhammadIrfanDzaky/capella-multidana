import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { SECTION_HEADING_CLASS } from "@/components/ui/typography";
import { APPLICATION_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupiah } from "@/lib/format";
import type { ApplicationDetail } from "@/server/queries/applications";

import { StatusBadge } from "./StatusBadge";

function Row({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-100 py-3 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <dt className="text-slate-600">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children}</dd>
    </div>
  );
}

export function ApplicationSummary({
  application,
}: {
  application: ApplicationDetail;
}) {
  return (
    <Card className="p-6">
      <h2 className={SECTION_HEADING_CLASS}>Data Pengajuan</h2>

      <dl className="grid gap-x-10 sm:grid-cols-2">
        <Row label="NIK">
          <span className="tabular-nums">{application.nik}</span>
        </Row>
        <Row label="Nama Lengkap Nasabah">{application.customerName}</Row>
        <Row label="Tipe Pengajuan">
          {APPLICATION_TYPE_LABELS[application.type]}
        </Row>
        <Row label="Tenor">{application.tenorMonths} bulan</Row>
        <Row label="Nominal Pengajuan">
          <span className="tabular-nums">
            {formatRupiah(application.amount)}
          </span>
        </Row>
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
          <Row label="Tanggal Keputusan" wide>
            {formatDate(application.decidedAt)}
          </Row>
        ) : null}
        <Row label="Catatan" wide>
          {application.notes ?? (
            <span className="font-normal text-slate-500">Tidak ada catatan.</span>
          )}
        </Row>
      </dl>
    </Card>
  );
}
