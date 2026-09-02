/**
 * Formatter dibuat sekali di tingkat modul. Membangun `Intl` berulang kali di
 * dalam render jauh lebih mahal daripada memanggil ulang instance yang sama.
 */

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Nilai masuk berupa integer rupiah penuh, tanpa pecahan sen. */
export function formatRupiah(amount: number) {
  return rupiahFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}
