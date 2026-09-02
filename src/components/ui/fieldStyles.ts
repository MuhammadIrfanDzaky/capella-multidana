/**
 * Kelas dasar untuk seluruh kontrol form agar tampilannya seragam.
 * Dipisahkan supaya Input, Select, dan Textarea tidak menyalin string yang sama.
 */
const BASE_FIELD =
  "w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50";

export function fieldClassName(hasError: boolean) {
  const stateClasses = hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-slate-300 focus:border-slate-400 focus:ring-slate-200";

  return `${BASE_FIELD} ${stateClasses}`;
}
