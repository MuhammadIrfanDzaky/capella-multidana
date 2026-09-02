"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { applications, customers } from "@/db/schema";
import {
  MAX_APPROVABLE_AMOUNT,
  MAX_APPROVABLE_TENOR_MONTHS,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
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

type DecisionResult = { ok: true } | { ok: false; message: string };

/**
 * Mengubah status pengajuan menjadi disetujui atau ditolak.
 *
 * Pembacaan dan penulisan dibungkus satu transaksi agar dua permintaan yang tiba
 * bersamaan tidak sama-sama melihat status "menunggu" lalu keduanya berhasil
 * mengubahnya.
 */
function decideApplication(
  applicationId: number,
  nextStatus: "APPROVED" | "REJECTED",
): DecisionResult {
  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    return { ok: false, message: "Pengajuan tidak ditemukan." };
  }

  return db.transaction((tx) => {
    const application = tx
      .select({
        status: applications.status,
        amount: applications.amount,
        tenorMonths: applications.tenorMonths,
      })
      .from(applications)
      .where(eq(applications.id, applicationId))
      .get();

    if (!application) {
      return { ok: false, message: "Pengajuan tidak ditemukan." };
    }

    // Keputusan bersifat sekali jalan: pengajuan yang sudah diproses tidak dapat
    // diubah lagi.
    if (application.status !== "PENDING") {
      return {
        ok: false,
        message: "Pengajuan ini sudah diproses dan tidak dapat diubah lagi.",
      };
    }

    // Batas nominal dan tenor hanya membatasi persetujuan. Pengajuan yang
    // melampauinya tetap boleh ditolak.
    if (nextStatus === "APPROVED") {
      if (application.amount > MAX_APPROVABLE_AMOUNT) {
        return {
          ok: false,
          message: `Nominal melebihi batas ${formatRupiah(
            MAX_APPROVABLE_AMOUNT,
          )} yang dapat disetujui.`,
        };
      }

      if (application.tenorMonths > MAX_APPROVABLE_TENOR_MONTHS) {
        return {
          ok: false,
          message: `Tenor melebihi batas ${MAX_APPROVABLE_TENOR_MONTHS} bulan yang dapat disetujui.`,
        };
      }
    }

    tx.update(applications)
      .set({ status: nextStatus, decidedAt: new Date() })
      .where(eq(applications.id, applicationId))
      .run();

    return { ok: true };
  });
}

function revalidateApplication(applicationId: number) {
  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
}

export async function approveApplication(
  applicationId: number,
): Promise<DecisionResult> {
  const result = decideApplication(applicationId, "APPROVED");

  if (result.ok) {
    revalidateApplication(applicationId);
  }

  return result;
}

export async function rejectApplication(
  applicationId: number,
): Promise<DecisionResult> {
  const result = decideApplication(applicationId, "REJECTED");

  if (result.ok) {
    revalidateApplication(applicationId);
  }

  return result;
}
