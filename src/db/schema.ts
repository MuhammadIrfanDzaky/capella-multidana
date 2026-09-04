import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { APPLICATION_STATUSES, APPLICATION_TYPES } from "@/lib/constants";

// NIK dipakai sebagai kunci identitas: nama lengkap tidak cukup membedakan orang,
// sedangkan aturan batas pengajuan menuntut identitas yang dapat diandalkan.
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nik: text("nik").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Nilai uang disimpan sebagai integer rupiah penuh, tidak pernah floating point,
 * agar selisih pembulatan tidak terakumulasi.
 *
 * `monthlyIncome` melekat di sini dan bukan di `customers` karena pendapatan
 * berubah seiring waktu, sedangkan kelayakan dinilai saat pengajuan dibuat.
 */
export const applications = sqliteTable(
  "applications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id),
    type: text("type", { enum: APPLICATION_TYPES }).notNull(),
    amount: integer("amount").notNull(),
    tenorMonths: integer("tenor_months").notNull(),
    monthlyIncome: integer("monthly_income").notNull(),
    notes: text("notes"),
    status: text("status", { enum: APPLICATION_STATUSES })
      .notNull()
      .default("PENDING"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    /** Terisi saat pengajuan disetujui atau ditolak; kosong selama masih menunggu. */
    decidedAt: integer("decided_at", { mode: "timestamp" }),
    /** Hanya terisi pada penolakan, dan pengisiannya tidak diwajibkan. */
    decisionNote: text("decision_note"),
  },
  (table) => [
    check("amount_positive", sql`${table.amount} > 0`),
    check("tenor_positive", sql`${table.tenorMonths} > 0`),
    check("monthly_income_positive", sql`${table.monthlyIncome} > 0`),
  ],
);
