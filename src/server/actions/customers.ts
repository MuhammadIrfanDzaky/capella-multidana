"use server";

import { MAX_APPLICATIONS_PER_CUSTOMER } from "@/lib/constants";
import { getCustomerEligibility } from "@/server/queries/applications";

export type NikLookup =
  | { registered: false }
  | {
      registered: true;
      fullName: string;
      applicationCount: number;
      atLimit: boolean;
    };

/**
 * Dipanggil dari form selagi NIK diketik, sehingga harus berupa Server Action:
 * lapisan query biasa hanya dapat dijalankan dari komponen server.
 *
 * Hasilnya semata-mata petunjuk. Aturan batas pengajuan tetap ditegakkan
 * `createApplication` di dalam transaksi, karena antara pengetikan dan penyimpanan
 * petugas lain dapat menambah pengajuan atas NIK yang sama.
 */
export async function lookupNik(nik: unknown): Promise<NikLookup | null> {
  // NIK yang belum lengkap tidak dianggap galat; pemanggilnya cukup tidak
  // menampilkan petunjuk apa pun.
  if (typeof nik !== "string" || !/^\d{16}$/.test(nik)) {
    return null;
  }

  const customer = getCustomerEligibility(nik);

  if (!customer) {
    return { registered: false };
  }

  return {
    registered: true,
    fullName: customer.fullName,
    applicationCount: customer.applicationCount,
    atLimit: customer.applicationCount >= MAX_APPLICATIONS_PER_CUSTOMER,
  };
}
