// Instance Intl dibuat sekali: membangunnya di dalam render jauh lebih mahal.
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number) {
  return rupiahFormatter.format(amount);
}

/** Nol di depan dibuang agar "025000000" tidak bertahan menjadi "025.000.000". */
export function formatThousands(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}
