import { sql } from "drizzle-orm";

import { applications, customers } from "./schema";
import { db } from "./index";

/**
 * Data contoh untuk pengembangan dan penilaian. Dijalankan dengan `npm run db:seed`.
 *
 * Nasabah dan NIK di bawah ini fiktif. Nominal disimpan sebagai integer rupiah
 * penuh, sama seperti pada skema.
 */

const customerSeed = [
  { nik: "1271010101900001", fullName: "Budi Santoso" },
  { nik: "1271014502920002", fullName: "Siti Rahmawati" },
  { nik: "1271012003880003", fullName: "Ahmad Fauzi" },
  // Nasabah ini sengaja sudah mencapai batas maksimal pengajuan, agar aturan
  // tersebut dapat diuji tanpa perlu mengisi form berkali-kali.
  { nik: "1271015507950004", fullName: "Dewi Lestari" },
];

const applicationSeed = [
  {
    nik: "1271010101900001",
    type: "MOTORCYCLE" as const,
    amount: 25_000_000,
    tenorMonths: 24,
    monthlyIncome: 4_500_000,
    notes: "Pengajuan untuk kendaraan operasional harian.",
    status: "PENDING" as const,
    createdAt: new Date("2026-08-28T09:15:00"),
  },
  {
    nik: "1271010101900001",
    type: "MULTIPURPOSE" as const,
    amount: 15_000_000,
    tenorMonths: 12,
    monthlyIncome: 4_500_000,
    notes: "Ditolak karena riwayat angsuran sebelumnya belum selesai.",
    status: "REJECTED" as const,
    createdAt: new Date("2026-08-14T14:40:00"),
  },
  {
    nik: "1271014502920002",
    type: "CAR" as const,
    amount: 180_000_000,
    tenorMonths: 24,
    monthlyIncome: 12_000_000,
    notes: null,
    status: "APPROVED" as const,
    createdAt: new Date("2026-08-21T10:05:00"),
  },
  {
    nik: "1271012003880003",
    type: "MULTIPURPOSE" as const,
    amount: 50_000_000,
    tenorMonths: 18,
    monthlyIncome: 7_000_000,
    notes: "Dana renovasi tempat usaha.",
    status: "PENDING" as const,
    createdAt: new Date("2026-09-01T16:20:00"),
  },
  {
    nik: "1271015507950004",
    type: "MOTORCYCLE" as const,
    amount: 18_000_000,
    tenorMonths: 12,
    monthlyIncome: 6_500_000,
    notes: null,
    status: "APPROVED" as const,
    createdAt: new Date("2026-06-10T09:00:00"),
  },
  {
    nik: "1271015507950004",
    type: "MULTIPURPOSE" as const,
    amount: 20_000_000,
    tenorMonths: 18,
    monthlyIncome: 6_500_000,
    notes: "Tambahan modal usaha.",
    status: "REJECTED" as const,
    createdAt: new Date("2026-07-18T11:30:00"),
  },
  {
    nik: "1271015507950004",
    type: "CAR" as const,
    amount: 120_000_000,
    tenorMonths: 24,
    monthlyIncome: 6_500_000,
    notes: null,
    status: "PENDING" as const,
    createdAt: new Date("2026-08-30T13:45:00"),
  },
];

function seed() {
  // Urutan penghapusan mengikuti arah foreign key: pengajuan lebih dulu.
  db.delete(applications).run();
  db.delete(customers).run();

  // AUTOINCREMENT menyimpan counter terpisah di `sqlite_sequence`. Tanpa reset
  // ini, id terus bertambah setiap seed diulang dan tautan detail ikut berubah.
  db.run(
    sql`delete from sqlite_sequence where name in ('applications', 'customers')`,
  );

  const insertedCustomers = db
    .insert(customers)
    .values(customerSeed)
    .returning({ id: customers.id, nik: customers.nik })
    .all();

  const customerIdByNik = new Map(
    insertedCustomers.map((customer) => [customer.nik, customer.id]),
  );

  const rows = applicationSeed.map(({ nik, ...application }) => {
    const customerId = customerIdByNik.get(nik);

    if (customerId === undefined) {
      throw new Error(`Nasabah dengan NIK ${nik} tidak ada pada data seed.`);
    }

    return { ...application, customerId };
  });

  db.insert(applications).values(rows).run();

  console.log(
    `Seed selesai: ${insertedCustomers.length} nasabah, ${rows.length} pengajuan.`,
  );
}

seed();
