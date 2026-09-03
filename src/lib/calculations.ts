import { INTEREST_RATE_PER_YEAR, type ApplicationType } from "@/lib/constants";

export type InstallmentBreakdown = {
  principal: number;
  /** Suku bunga flat per tahun, misalnya 0.12 untuk 12%. */
  ratePerYear: number;
  totalInterest: number;
  totalPayment: number;
  monthlyInstallment: number;
};

type InstallmentInput = {
  type: ApplicationType;
  amount: number;
  tenorMonths: number;
};

/**
 * Metode bunga flat:
 *
 *   totalBunga = pokok x rate per tahun x (tenor / 12)
 *   angsuran   = (pokok + totalBunga) / tenor
 *
 * Fungsi ini murni, tanpa akses basis data — jangan tambahkan efek samping.
 */
export function calculateInstallment({
  type,
  amount,
  tenorMonths,
}: InstallmentInput): InstallmentBreakdown {
  if (tenorMonths <= 0) {
    throw new Error("Tenor harus lebih besar dari nol bulan.");
  }

  const ratePerYear = INTEREST_RATE_PER_YEAR[type];

  // Dibulatkan lebih dulu agar seluruh angka yang ditampilkan saling konsisten.
  const totalInterest = Math.round(amount * ratePerYear * (tenorMonths / 12));
  const totalPayment = amount + totalInterest;
  const monthlyInstallment = Math.round(totalPayment / tenorMonths);

  return {
    principal: amount,
    ratePerYear,
    totalInterest,
    totalPayment,
    monthlyInstallment,
  };
}
