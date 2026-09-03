import { Card } from "@/components/ui/Card";
import { SECTION_HEADING_CLASS } from "@/components/ui/typography";
import { calculateInstallment } from "@/lib/calculations";
import type { ApplicationType } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";

type InstallmentBreakdownProps = {
  type: ApplicationType;
  amount: number;
  tenorMonths: number;
};

export function InstallmentBreakdown(props: InstallmentBreakdownProps) {
  const { ratePerYear, principal, totalInterest, totalPayment, monthlyInstallment } =
    calculateInstallment(props);

  const rows = [
    { label: "Pokok pinjaman", value: formatRupiah(principal) },
    {
      label: "Suku bunga per tahun",
      value: `${(ratePerYear * 100).toFixed(0)}% flat`,
    },
    {
      label: `Total bunga selama ${props.tenorMonths} bulan`,
      value: formatRupiah(totalInterest),
    },
    { label: "Total pembayaran", value: formatRupiah(totalPayment) },
  ];

  return (
    <Card className="p-6">
      <h2 className={SECTION_HEADING_CLASS}>Rincian Pembayaran</h2>

      <dl className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-3">
            <dt className="text-slate-600">{row.label}</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-brand-200 bg-brand-100 px-4 py-3">
        <p className="font-semibold text-ink">Tagihan per bulan</p>
        <p className="text-2xl font-bold tabular-nums text-ink">
          {formatRupiah(monthlyInstallment)}
        </p>
      </div>

      <p className="mt-3 text-sm text-slate-600">
        Perhitungan memakai metode bunga flat. Suku bunga bersifat ilustratif dan
        bukan suku bunga resmi perusahaan.
      </p>
    </Card>
  );
}
