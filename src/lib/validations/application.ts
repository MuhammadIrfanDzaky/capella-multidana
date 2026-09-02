import { z } from "zod";

import {
  APPLICATION_TYPES,
  MAX_APPROVABLE_AMOUNT,
  MIN_MONTHLY_INCOME,
  TENOR_OPTIONS,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/format";

/**
 * Field nominal rupiah. Nilainya diterima sebagai teks agar pesan galat dapat
 * dibaca pengguna, lalu diubah menjadi bilangan bulat setelah lolos pemeriksaan
 * bentuk. Pembatasan nilainya dirangkai terpisah oleh masing-masing field.
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
 * Skema ini adalah satu-satunya tempat aturan bentuk dituliskan, dan dipakai di
 * dua sisi: `react-hook-form` di peramban untuk umpan balik langsung, serta
 * Server Action sebagai penegakan yang sebenarnya. Validasi di peramban dapat
 * dilewati, validasi di server tidak.
 *
 * Aturan yang membutuhkan pembacaan basis data — batas jumlah pengajuan per
 * nasabah — tidak dapat diwakili di sini dan ditegakkan pada Server Action.
 */
export const applicationFormSchema = z.object({
  nik: z
    .string()
    .trim()
    .min(1, "NIK wajib diisi")
    .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),

  fullName: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama lengkap minimal 3 karakter"),

  type: z.enum(APPLICATION_TYPES, "Tipe pengajuan wajib dipilih"),

  amount: rupiahField("Nominal pengajuan").pipe(
    z
      .number()
      .positive("Nominal pengajuan harus lebih dari nol")
      .max(
        MAX_APPROVABLE_AMOUNT,
        `Nominal pengajuan maksimal ${formatRupiah(MAX_APPROVABLE_AMOUNT)}`,
      ),
  ),

  tenorMonths: z
    .string()
    .trim()
    .min(1, "Tenor wajib dipilih")
    .transform(Number)
    .pipe(
      z
        .number()
        .refine(
          (value) => (TENOR_OPTIONS as readonly number[]).includes(value),
          "Tenor yang dipilih tidak tersedia",
        ),
    ),

  monthlyIncome: rupiahField("Pendapatan bulanan").pipe(
    // Pesan ini disalin persis dari soal dan tidak boleh diparafrasekan.
    z.number().min(MIN_MONTHLY_INCOME, "Nasabah belum dapat mengajukan pinjaman"),
  ),

  notes: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .transform((value) => (value.length > 0 ? value : null)),
});

/** Nilai mentah yang dipegang form, seluruhnya berupa teks. */
export type ApplicationFormInput = z.input<typeof applicationFormSchema>;

/** Nilai setelah validasi, siap disimpan ke basis data. */
export type ApplicationFormValues = z.output<typeof applicationFormSchema>;

/** Nama field yang dapat menerima pesan galat dari server. */
export type ApplicationFormField = keyof ApplicationFormInput;
