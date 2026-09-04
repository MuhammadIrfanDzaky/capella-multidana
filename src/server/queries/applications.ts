import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { applications, customers } from "@/db/schema";

/**
 * Sinkron karena driver `better-sqlite3` memang sinkron — jangan dibungkus Promise,
 * itu hanya menyamarkan sifat sebenarnya.
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

/** Mengembalikan `undefined` bila id tidak ada; halaman pemanggil yang menentukan tampilannya. */
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
      decidedAt: applications.decidedAt,
      decisionNote: applications.decisionNote,
    })
    .from(applications)
    .innerJoin(customers, eq(customers.id, applications.customerId))
    .where(eq(applications.id, id))
    .get();
}

export type ApplicationDetail = NonNullable<
  ReturnType<typeof getApplicationById>
>;

/**
 * Menghitung pengajuan milik sebuah NIK untuk memberi petunjuk kelayakan selagi
 * NIK diketik. `leftJoin`, bukan `innerJoin`: nasabah yang belum punya pengajuan
 * sama sekali tetap harus ditemukan, dengan jumlah nol.
 *
 * Mengembalikan `undefined` bila NIK belum terdaftar, yang berarti nasabah baru.
 */
export function getCustomerEligibility(nik: string) {
  return db
    .select({
      fullName: customers.fullName,
      applicationCount: count(applications.id),
    })
    .from(customers)
    .leftJoin(applications, eq(applications.customerId, customers.id))
    .where(eq(customers.nik, nik))
    .groupBy(customers.id)
    .get();
}
