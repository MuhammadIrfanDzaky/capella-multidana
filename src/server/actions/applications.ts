"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { applications, customers } from "@/db/schema";
import {
  MAX_APPLICATIONS_PER_CUSTOMER,
  MAX_APPROVABLE_AMOUNT,
  MAX_APPROVABLE_TENOR_MONTHS,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import {
  applicationFormSchema,
  type ApplicationFormField,
} from "@/lib/validations/application";

type FieldErrors = Partial<Record<ApplicationFormField, string>>;

type CreateApplicationResult =
  | { ok: true; applicationId: number }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

/** Beda huruf besar-kecil atau spasi ganda bukan orang yang berbeda. */
function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Masukan sengaja bertipe `unknown` dan divalidasi ulang di sini: validasi di
 * peramban dapat dilewati, sehingga server tetap penentu akhir.
 */
export async function createApplication(
  input: unknown,
): Promise<CreateApplicationResult> {
  const parsed = applicationFormSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as ApplicationFormField] = issue.message;
      }
    }

    return {
      ok: false,
      message: "Periksa kembali isian yang ditandai.",
      fieldErrors,
    };
  }

  const { nik, fullName, ...application } = parsed.data;

  // Seluruh pemeriksaan yang bergantung pada isi basis data dan penyimpanannya
  // dijalankan dalam satu transaksi. Tanpa itu, dua pengajuan yang dikirim
  // bersamaan dapat sama-sama lolos batas jumlah pengajuan.
  return db.transaction((tx): CreateApplicationResult => {
    const existingCustomer = tx
      .select({ id: customers.id, fullName: customers.fullName })
      .from(customers)
      .where(eq(customers.nik, nik))
      .get();

    if (existingCustomer) {
      if (normalizeName(existingCustomer.fullName) !== normalizeName(fullName)) {
        return {
          ok: false,
          message: "NIK tidak cocok dengan nama nasabah.",
          fieldErrors: {
            nik: `NIK ini sudah terdaftar atas nama ${existingCustomer.fullName}.`,
          },
        };
      }

      const existingApplications = tx
        .select({ total: count() })
        .from(applications)
        .where(eq(applications.customerId, existingCustomer.id))
        .get();

      if ((existingApplications?.total ?? 0) >= MAX_APPLICATIONS_PER_CUSTOMER) {
        return {
          ok: false,
          message: `Nasabah ini sudah mencapai batas maksimal ${MAX_APPLICATIONS_PER_CUSTOMER} pengajuan.`,
          fieldErrors: {
            nik: `Nasabah dengan NIK ini sudah memiliki ${MAX_APPLICATIONS_PER_CUSTOMER} pengajuan.`,
          },
        };
      }
    }

    const customerId =
      existingCustomer?.id ??
      tx
        .insert(customers)
        .values({ nik, fullName })
        .returning({ id: customers.id })
        .get().id;

    const applicationId = tx
      .insert(applications)
      .values({ ...application, customerId })
      .returning({ id: applications.id })
      .get().id;

    revalidatePath("/applications");

    return { ok: true, applicationId };
  });
}

type DecisionResult = { ok: true } | { ok: false; message: string };

/**
 * Pembacaan dan penulisan wajib satu transaksi: tanpa itu, dua permintaan yang
 * tiba bersamaan sama-sama melihat status "menunggu" dan keduanya berhasil.
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

    // Keputusan bersifat sekali jalan.
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
