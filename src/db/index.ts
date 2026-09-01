import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const DATABASE_FILE = process.env.DATABASE_URL ?? "./data/app.db";

/**
 * Next.js memuat ulang modul setiap kali ada perubahan di mode development,
 * sehingga koneksi baru akan menumpuk. Instance disimpan pada `globalThis`
 * agar hanya ada satu koneksi selama proses berjalan.
 */
const globalForDb = globalThis as unknown as {
  sqliteConnection?: Database.Database;
};

const sqlite = globalForDb.sqliteConnection ?? new Database(DATABASE_FILE);

// SQLite tidak menegakkan foreign key kecuali diaktifkan per koneksi.
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqliteConnection = sqlite;
}

export const db = drizzle(sqlite, { schema });
