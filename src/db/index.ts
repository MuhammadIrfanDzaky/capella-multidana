import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const DATABASE_FILE = process.env.DATABASE_URL ?? "./data/app.db";

// Next.js memuat ulang modul tiap perubahan di mode development; tanpa cache pada
// `globalThis`, koneksi SQLite menumpuk sampai berkasnya terkunci.
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
