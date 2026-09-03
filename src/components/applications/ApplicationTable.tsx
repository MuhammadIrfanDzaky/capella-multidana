import Link from "next/link";

import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EyeIcon } from "@/components/ui/icons";
import { COMPACT_ACTION_LABEL } from "@/components/ui/layout";
import { Tooltip } from "@/components/ui/Tooltip";
import { calculateInstallment } from "@/lib/calculations";
import { APPLICATION_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupiah } from "@/lib/format";
import type { ApplicationListItem } from "@/server/queries/applications";

import { DecisionActions } from "./DecisionActions";
import { StatusBadge } from "./StatusBadge";

// Judul kolom dan angka tidak boleh membungkus; tabel bergeser mendatar bila sempit.
const HEAD_CELL =
  "px-4 py-3 text-left font-semibold whitespace-nowrap text-slate-700";
const HEAD_CELL_NUMERIC =
  "px-4 py-3 text-right font-semibold whitespace-nowrap text-slate-700";
const CELL = "px-4 py-3 align-middle";
const CELL_NUMERIC =
  "px-4 py-3 text-right align-middle whitespace-nowrap tabular-nums";

export function ApplicationTable({
  applications,
}: {
  applications: ApplicationListItem[];
}) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-3xl border-collapse text-base">
        <caption className="sr-only">
          Daftar pengajuan kredit nasabah beserta status terkini.
        </caption>
        <thead className="border-b border-slate-200 bg-slate-50 text-sm">
          <tr>
            <th scope="col" className={HEAD_CELL}>
              Nama Nasabah
            </th>
            <th scope="col" className={HEAD_CELL}>
              Tipe Pengajuan
            </th>
            <th scope="col" className={HEAD_CELL_NUMERIC}>
              Nominal
            </th>
            <th scope="col" className={HEAD_CELL_NUMERIC}>
              Tenor
            </th>
            <th scope="col" className={HEAD_CELL_NUMERIC}>
              Tagihan / Bulan
            </th>
            <th scope="col" className={HEAD_CELL}>
              Tanggal Pengajuan
            </th>
            <th scope="col" className={HEAD_CELL}>
              Status
            </th>
            <th scope="col" className={HEAD_CELL}>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {applications.map((application) => {
            const { monthlyInstallment } = calculateInstallment(application);

            return (
              <tr key={application.id} className="hover:bg-slate-50">
                <th scope="row" className={`${CELL} font-medium`}>
                  {application.customerName}
                </th>
                <td className={`${CELL} whitespace-nowrap`}>
                  {APPLICATION_TYPE_LABELS[application.type]}
                </td>
                <td className={CELL_NUMERIC}>
                  {formatRupiah(application.amount)}
                </td>
                <td className={CELL_NUMERIC}>
                  {application.tenorMonths} bln
                </td>
                <td className={`${CELL_NUMERIC} font-medium`}>
                  {formatRupiah(monthlyInstallment)}
                </td>
                <td className={`${CELL} whitespace-nowrap`}>
                  {formatDate(application.createdAt)}
                </td>
                <td className={CELL}>
                  <StatusBadge status={application.status} />
                </td>
                <td className={`${CELL} whitespace-nowrap`}>
                  <div className="flex items-center gap-2">
                    <Tooltip label="Detail">
                      <Link
                        href={`/applications/${application.id}`}
                        aria-label={`Lihat detail pengajuan ${application.customerName}`}
                        className={buttonClassName("secondary", "sm")}
                      >
                        <EyeIcon />
                        <span className={COMPACT_ACTION_LABEL}>Detail</span>
                      </Link>
                    </Tooltip>

                    {/* Keputusan hanya tersedia selama pengajuan masih menunggu. */}
                    {application.status === "PENDING" ? (
                      <DecisionActions
                        applicationId={application.id}
                        customerName={application.customerName}
                        amount={application.amount}
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
