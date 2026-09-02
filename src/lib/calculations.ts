import { INTEREST_RATE_PER_YEAR, type ApplicationType } from "@/lib/constants";

export type InstallmentBreakdown = {
  /** Pokok pinjaman, dalam rupiah penuh. */
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
 * Menghitung angsuran dengan metode bunga flat:
 *
 *   totalBunga = pokok x rate per tahun x (tenor / 12)
 *   angsuran   = (pokok + totalBunga) / tenor
 *
 * Bunga flat dipilih karena itulah praktik yang lazim pada pembiayaan kendaraan
 * di Indonesia, dan menghasilkan cicilan tetap tiap bulan sehingga cocok dengan
 * satu kolom "tagihan per bulan". Alternatifnya, anuitas, menghasilkan angsuran
 * yang komposisinya berubah tiap bulan dan tidak diperlukan di sini.
 *
 * Fungsi ini murni: tanpa akses database dan tanpa efek samping, sehingga hasil
 * yang sama selalu didapat untuk masukan yang sama.
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

  // Dibulatkan ke rupiah penuh lebih dulu agar seluruh angka yang ditampilkan
  // konsisten satu sama lain, bukan hasil pembulatan yang berbeda-beda.
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
