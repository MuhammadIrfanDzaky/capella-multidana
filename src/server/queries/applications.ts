import { desc, eq } from "drizzle-orm";

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
    })
    .from(applications)
    .innerJoin(customers, eq(customers.id, applications.customerId))
    .where(eq(applications.id, id))
    .get();
}

export type ApplicationDetail = NonNullable<
  ReturnType<typeof getApplicationById>
>;
