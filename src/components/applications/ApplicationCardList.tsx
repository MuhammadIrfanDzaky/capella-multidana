import Link from "next/link";
import type { ReactNode } from "react";

import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { calculateInstallment } from "@/lib/calculations";
import { APPLICATION_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupiah } from "@/lib/format";
import type { ApplicationListItem } from "@/server/queries/applications";

import { DecisionActions } from "./DecisionActions";
import { StatusBadge } from "./StatusBadge";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children}</dd>
    </div>
  );
}

/**
 * Tabel delapan kolom tidak muat pada layar sempit, dan menggesernya mendatar
 * menyembunyikan tombol aksi — padahal menyetujui pengajuan adalah pekerjaan
 * utama halaman ini. Di bawah `xl`, tiap pengajuan ditampilkan sebagai kartu
 * dengan tombol aksinya selalu terlihat.
 */
export function ApplicationCardList({
  applications,
}: {
  applications: ApplicationListItem[];
}) {
  return (
    <ul className="space-y-4 xl:hidden">
      {applications.map((application) => {
        const { monthlyInstallment } = calculateInstallment(application);

        return (
          <li key={application.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-slate-900">
                  {application.customerName}
                </p>
                <StatusBadge status={application.status} />
              </div>

              <dl className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                <Row label="Tipe Pengajuan">
                  {APPLICATION_TYPE_LABELS[application.type]}
                </Row>
                <Row label="Nominal">
                  <span className="tabular-nums">
                    {formatRupiah(application.amount)}
                  </span>
                </Row>
                <Row label="Tenor">{application.tenorMonths} bulan</Row>
                <Row label="Tagihan / Bulan">
                  <span className="tabular-nums">
                    {formatRupiah(monthlyInstallment)}
                  </span>
                </Row>
                <Row label="Tanggal Pengajuan">
                  {formatDate(application.createdAt)}
                </Row>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/applications/${application.id}`}
                  className={`${buttonClassName("secondary")} w-full sm:w-auto`}
                >
                  Detail
                </Link>

                {application.status === "PENDING" ? (
                  <DecisionActions
                    applicationId={application.id}
                    customerName={application.customerName}
                    amount={application.amount}
                  />
                ) : null}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
