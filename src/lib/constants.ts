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

/**
 * Suku bunga flat per tahun, dibedakan menurut tipe pengajuan: kendaraan roda
 * dua berisiko lebih tinggi daripada roda empat, dan multiguna tidak beragunan
 * kendaraan sehingga paling tinggi.
 *
 * Angka ini ilustratif untuk keperluan prototype, bukan suku bunga resmi
 * CMD Finance. Pada sistem produksi suku bunga wajib disimpan per pengajuan:
 * rate berubah seiring waktu, dan angsuran pengajuan lama tidak boleh ikut
 * berubah ketika rate baru berlaku.
 */
export const INTEREST_RATE_PER_YEAR: Record<ApplicationType, number> = {
  MOTORCYCLE: 0.12,
  CAR: 0.09,
  MULTIPURPOSE: 0.15,
};
