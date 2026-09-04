import { z } from "zod";

import {
  APPLICATION_TYPES,
  APPLICATION_TYPE_LABELS,
  MAX_APPROVABLE_AMOUNT,
  MIN_MONTHLY_INCOME,
  TENOR_RULES,
  tenorOptionsFor,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/format";

/**
 * Diterima sebagai teks, bukan `z.number()`: input kosong menghasilkan `NaN` yang
 * pesan galatnya tidak dapat dibaca pengguna.
 */
function rupiahField(label: string) {
  return (
    z
      .string()
      .trim()
      .min(1, `${label} wajib diisi`)
      // Kolomnya merapikan angka selagi diketik, sehingga nilai yang dikirim
      // memuat pemisah ribuan. Pemisah dibuang lebih dulu, lalu sisanya tetap
      // diperiksa harus berupa digit semua.
      .transform((value) => value.replace(/\./g, ""))
      .pipe(z.string().regex(/^\d+$/, `${label} hanya boleh berisi angka`))
      .transform(Number)
  );
}

/**
 * Satu-satunya tempat aturan bentuk dituliskan, dipakai peramban dan server
 * sekaligus. Aturan yang membutuhkan pembacaan basis data tidak dapat diwakili
 * di sini dan ditegakkan pada Server Action.
 */
export const applicationFormSchema = z
  .object({
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
      .transform(Number),

    monthlyIncome: rupiahField("Pendapatan bulanan").pipe(
      // Pesan ini disalin persis dari soal dan tidak boleh diparafrasekan.
      z
        .number()
        .min(MIN_MONTHLY_INCOME, "Nasabah belum dapat mengajukan pinjaman"),
    ),

    notes: z
      .string()
      .trim()
      .max(500, "Catatan maksimal 500 karakter")
      .transform((value) => (value.length > 0 ? value : null)),
  })
  // Tenor bergantung pada tipe, jadi pemeriksaannya naik ke tingkat objek.
  // `path` dikembalikan agar galatnya muncul di kolom tenor, bukan sebagai galat form.
  .superRefine((values, ctx) => {
    if (tenorOptionsFor(values.type).includes(values.tenorMonths)) {
      return;
    }

    ctx.addIssue({
      code: "custom",
      path: ["tenorMonths"],
      message: `Tenor untuk ${APPLICATION_TYPE_LABELS[values.type]} harus kelipatan ${TENOR_RULES[values.type].step} bulan, maksimal ${TENOR_RULES[values.type].max} bulan`,
    });
  });

/**
 * Alasan penolakan. Tidak diwajibkan: sebagian penolakan sudah jelas dari datanya
 * sendiri, dan mewajibkannya menambah jalur galat di dalam dialog. Batas panjangnya
 * disamakan dengan catatan pengajuan agar hanya ada satu angka yang perlu diingat.
 */
export const decisionNoteSchema = z
  .string()
  .trim()
  .max(500, "Alasan penolakan maksimal 500 karakter")
  .transform((value) => (value.length > 0 ? value : null));

/** Nilai mentah yang dipegang form, seluruhnya berupa teks. */
export type ApplicationFormInput = z.input<typeof applicationFormSchema>;

/** Nilai setelah validasi, siap disimpan ke basis data. */
export type ApplicationFormValues = z.output<typeof applicationFormSchema>;

export type ApplicationFormField = keyof ApplicationFormInput;
