// Ukuran vertikal ditentukan tiap komponen: input dan textarea berbeda kebutuhan.
const BASE_FIELD =
  "w-full rounded-lg border px-3.5 text-base outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

/**
 * Warna latar ikut ditentukan di sini, bukan ditumpuk oleh pemanggil. Menumpuk
 * `bg-slate-100` di atas `bg-white` tidak berhasil: kekhususan keduanya sama,
 * sehingga yang menang adalah yang kebetulan ditulis belakangan pada stylesheet.
 */
export function fieldClassName(hasError: boolean, isReadOnly = false) {
  const stateClasses = hasError
    ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
    : "border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-brand-200";

  const surface = isReadOnly
    ? "bg-slate-100 text-slate-600"
    : "bg-white text-slate-900";

  return `${BASE_FIELD} ${surface} ${stateClasses}`;
}

export const SINGLE_LINE_FIELD = "h-11";

export const LABEL_CLASS = "block text-base font-medium text-slate-800";
export const ERROR_CLASS = "text-sm font-medium text-red-700";

/**
 * Petunjuk berbeda dari galat: pengguna belum melakukan kesalahan apa pun, jadi
 * warnanya tidak boleh merah. Nada `warning` dipakai ketika petunjuknya
 * memberitahukan halangan yang sudah pasti, misalnya nasabah yang kuotanya penuh.
 */
export const HINT_CLASS = "text-sm text-slate-600";
export const HINT_WARNING_CLASS = "text-sm font-medium text-amber-700";
