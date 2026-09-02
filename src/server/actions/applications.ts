"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { applications, customers } from "@/db/schema";
import { applicationFormSchema } from "@/lib/validations/application";

type CreateApplicationResult =
  | { ok: true; applicationId: number }
  | { ok: false; message: string };

/**
 * Menyimpan pengajuan baru.
 *
 * Masukan sengaja bertipe `unknown` dan divalidasi ulang di sini: validasi di
 * sisi client hanya bersifat kenyamanan dan dapat dilewati, sehingga server
 * tetap menjadi penentu akhir.
 */
export async function createApplication(
  input: unknown,
): Promise<CreateApplicationResult> {
  const parsed = applicationFormSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Data pengajuan tidak valid." };
  }

  const { nik, fullName, ...application } = parsed.data;

  // Pembuatan nasabah dan pengajuan dijalankan dalam satu transaksi agar tidak
  // menyisakan nasabah tanpa pengajuan ketika penyimpanan gagal di tengah.
  const applicationId = db.transaction((tx) => {
    const existingCustomer = tx
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.nik, nik))
      .get();

    const customerId =
      existingCustomer?.id ??
      tx
        .insert(customers)
        .values({ nik, fullName })
        .returning({ id: customers.id })
        .get().id;

    return tx
      .insert(applications)
      .values({ ...application, customerId })
      .returning({ id: applications.id })
      .get().id;
  });

  // Daftar pengajuan harus ikut menampilkan baris baru ini pada navigasi
  // berikutnya, termasuk ketika halaman diambil dari cache router di sisi client.
  revalidatePath("/applications");

  return { ok: true, applicationId };
}
