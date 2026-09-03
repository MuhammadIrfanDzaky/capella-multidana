// Kosakata domain bersama. Modul ini tidak boleh mengimpor lapisan basis data:
// komponen client mengimpornya, dan Drizzle akan ikut terbawa ke bundle peramban.

export const APPLICATION_TYPES = ["MOTORCYCLE", "CAR", "MULTIPURPOSE"] as const;
export const APPLICATION_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export type ApplicationType = (typeof APPLICATION_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  MOTORCYCLE: "Sepeda Motor",
  CAR: "Mobil",
  MULTIPURPOSE: "Multiguna",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

/**
 * Yang disimpan adalah aturannya, bukan daftar jadinya, sehingga tidak mungkin
 * ada daftar yang diam-diam bertentangan dengan batas maksimalnya.
 */
export const TENOR_RULES: Record<
  ApplicationType,
  { step: number; max: number }
> = {
  MOTORCYCLE: { step: 3, max: 24 },
  CAR: { step: 6, max: 24 },
  MULTIPURPOSE: { step: 3, max: 24 },
};

export function tenorOptionsFor(type: ApplicationType): number[] {
  const { step, max } = TENOR_RULES[type];

  return Array.from(
    { length: Math.floor(max / step) },
    (_, index) => (index + 1) * step,
  );
}

/**
 * Soal menuliskannya sebagai nominal maksimal yang "dapat disetujui", sehingga
 * batas ini ditegakkan pada aksi persetujuan, bukan hanya pada form.
 */
export const MAX_APPROVABLE_AMOUNT = 200_000_000;
export const MAX_APPROVABLE_TENOR_MONTHS = 24;

export const MIN_MONTHLY_INCOME = 1_000_000;

/**
 * Soal tidak menjelaskan apakah yang dihitung seluruh pengajuan atau hanya yang
 * masih berjalan. Yang dipakai di sini bacaan harfiahnya: seluruh pengajuan
 * milik nasabah tersebut, apa pun statusnya.
 */
export const MAX_APPLICATIONS_PER_CUSTOMER = 3;

/**
 * Angka ini ILUSTRATIF, bukan suku bunga resmi CMD Finance.
 *
 * Pada sistem produksi suku bunga wajib disimpan per pengajuan: rate berubah
 * seiring waktu, dan angsuran pengajuan lama tidak boleh ikut berubah.
 */
export const INTEREST_RATE_PER_YEAR: Record<ApplicationType, number> = {
  MOTORCYCLE: 0.24,
  CAR: 0.15,
  MULTIPURPOSE: 0.3,
};
