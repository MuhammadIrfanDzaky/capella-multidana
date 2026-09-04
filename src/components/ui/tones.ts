/**
 * Perbendaharaan warna keadaan, dipakai bersama Badge dan Alert. Dikumpulkan di
 * satu tempat agar keduanya tidak perlahan bergeser menjadi hijau yang berbeda.
 */
export type Tone = "neutral" | "success" | "danger";

export const TONE_SURFACE: Record<Tone, string> = {
  neutral: "border-slate-300 bg-slate-100 text-slate-700",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  danger: "border-red-300 bg-red-50 text-red-800",
};
