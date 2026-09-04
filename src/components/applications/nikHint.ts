import { MAX_APPLICATIONS_PER_CUSTOMER } from "@/lib/constants";
import type { NikLookup } from "@/server/actions/customers";

export type NikHint = { text: string; tone: "neutral" | "warning" };

/**
 * Menerjemahkan hasil penelusuran NIK menjadi kalimat untuk pengguna. Dipisahkan
 * dari komponennya karena inilah bagian yang benar-benar punya aturan, dan
 * karena itu dapat diuji tanpa merender apa pun.
 */
export function nikHintFor(lookup: NikLookup | null): NikHint | null {
  if (!lookup) {
    return null;
  }

  if (!lookup.registered) {
    return {
      text: "NIK belum terdaftar. Nasabah baru akan dibuat.",
      tone: "neutral",
    };
  }

  // Nama tidak diulang di sini: begitu NIK dikenali, namanya sudah terisi pada
  // kolomnya sendiri, dan mengulanginya hanya menyita perhatian dua kali.
  if (lookup.atLimit) {
    return {
      text: `Nasabah ini sudah mencapai batas ${MAX_APPLICATIONS_PER_CUSTOMER} pengajuan.`,
      tone: "warning",
    };
  }

  return {
    text: `Nasabah terdaftar. Sudah ada ${lookup.applicationCount} dari ${MAX_APPLICATIONS_PER_CUSTOMER} pengajuan.`,
    tone: "neutral",
  };
}
