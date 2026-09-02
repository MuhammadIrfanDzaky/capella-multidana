/**
 * Kosakata domain yang dipakai bersama oleh lapisan database, validasi, dan UI.
 *
 * Nilai disimpan dalam bahasa Inggris agar konsisten dengan identifier lain,
 * sedangkan label Indonesia hanya dipakai saat ditampilkan ke pengguna.
 */

export const APPLICATION_TYPES = ["MOTORCYCLE", "CAR", "MULTIPURPOSE"] as const;
export const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

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

/** Tenor yang tersedia, dalam bulan. Soal membatasi tenor tertinggi 24 bulan. */
export const TENOR_OPTIONS = [12, 18, 24] as const;
