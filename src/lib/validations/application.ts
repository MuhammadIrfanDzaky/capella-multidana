import { z } from "zod";

import { APPLICATION_TYPES } from "@/lib/constants";

/**
 * Field nominal rupiah. Nilainya diterima sebagai teks agar pesan error dapat
 * dibaca pengguna, lalu diubah menjadi integer setelah lolos validasi.
 */
function rupiahField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .regex(/^\d+$/, `${label} hanya boleh berisi angka`)
    .transform(Number);
}

/**
 * Bentuk masukan form pengajuan.
 *
 * Skema ini dipakai di dua tempat: `react-hook-form` di sisi client untuk umpan
 * balik langsung, dan Server Action di sisi server sebagai penegakan yang
 * sebenarnya. Aturan bisnis (batas nominal, pendapatan minimum, batas jumlah
 * pengajuan per nasabah) menyusul pada tahap berikutnya.
 */
export const applicationFormSchema = z.object({
  nik: z.string().trim().min(1, "NIK wajib diisi"),
  fullName: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  type: z.enum(APPLICATION_TYPES, "Tipe pengajuan wajib dipilih"),
  amount: rupiahField("Nominal pengajuan"),
  tenorMonths: z
    .string()
    .trim()
    .min(1, "Tenor wajib dipilih")
    .transform(Number),
  monthlyIncome: rupiahField("Pendapatan bulanan"),
  notes: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .transform((value) => (value.length > 0 ? value : null)),
});

/** Nilai mentah yang dipegang form, seluruhnya berupa teks. */
export type ApplicationFormInput = z.input<typeof applicationFormSchema>;

/** Nilai setelah validasi, siap disimpan ke database. */
export type ApplicationFormValues = z.output<typeof applicationFormSchema>;
