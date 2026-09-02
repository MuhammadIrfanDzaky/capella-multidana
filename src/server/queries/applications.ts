import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { applications, customers } from "@/db/schema";

/**
 * Mengambil seluruh pengajuan beserta nama nasabahnya, terbaru lebih dulu.
 *
 * Kolom dipilih secara eksplisit, bukan `select()` polos, agar hanya data yang
 * benar-benar ditampilkan tabel yang ikut terbawa. Angsuran per bulan sengaja
 * tidak ikut di sini karena bukan data tersimpan, melainkan hasil hitungan.
 *
 * Fungsi ini sinkron karena driver `better-sqlite3` memang sinkron; membungkusnya
 * dengan Promise hanya akan menyamarkan sifat sebenarnya.
 */
export function getApplications() {
  return db
    .select({
      id: applications.id,
      customerName: customers.fullName,
      type: applications.type,
      amount: applications.amount,
      tenorMonths: applications.tenorMonths,
      status: applications.status,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(customers, eq(customers.id, applications.customerId))
    .orderBy(desc(applications.createdAt))
    .all();
}

export type ApplicationListItem = ReturnType<typeof getApplications>[number];

/**
 * Mengambil satu pengajuan beserta identitas nasabahnya. Mengembalikan
 * `undefined` bila id tidak ada, sehingga halaman pemanggil yang menentukan
 * bagaimana kondisi itu ditampilkan.
 *
 * Kolom yang diambil lebih lengkap daripada `getApplications` karena halaman
 * detail menampilkan pendapatan dan catatan yang tidak muat di tabel.
 */
export function getApplicationById(id: number) {
  return db
    .select({
      id: applications.id,
      customerName: customers.fullName,
      nik: customers.nik,
      type: applications.type,
      amount: applications.amount,
      tenorMonths: applications.tenorMonths,
      monthlyIncome: applications.monthlyIncome,
      notes: applications.notes,
      status: applications.status,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(customers, eq(customers.id, applications.customerId))
    .where(eq(applications.id, id))
    .get();
}

export type ApplicationDetail = NonNullable<
  ReturnType<typeof getApplicationById>
>;
