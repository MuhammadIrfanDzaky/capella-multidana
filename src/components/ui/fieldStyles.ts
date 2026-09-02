/**
 * Tampilan bersama seluruh kontrol form. Ukuran vertikal ditentukan masing-masing
 * komponen karena input dan textarea punya kebutuhan tinggi yang berbeda.
 *
 * Indikator fokus memakai border gelap plus halo gold agar tetap terlihat jelas
 * bagi pengguna yang menavigasi dengan keyboard.
 */
const BASE_FIELD =
  "w-full rounded-lg border bg-white px-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

export function fieldClassName(hasError: boolean) {
  const stateClasses = hasError
    ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
    : "border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-brand-200";

  return `${BASE_FIELD} ${stateClasses}`;
}

/** Tinggi seragam 44px untuk kontrol satu baris: target klik yang nyaman. */
export const SINGLE_LINE_FIELD = "h-11";

export const LABEL_CLASS = "block text-base font-medium text-slate-800";
export const HINT_CLASS = "text-sm text-slate-600";
export const ERROR_CLASS = "text-sm font-medium text-red-700";
