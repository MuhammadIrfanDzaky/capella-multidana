/**
 * Kosakata domain yang dipakai bersama oleh lapisan database, validasi, dan UI.
 *
 * Nilai disimpan dalam bahasa Inggris agar konsisten dengan identifier lain,
 * sedangkan label Indonesia hanya dipakai saat ditampilkan ke pengguna.
 */

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
 * Aturan tenor per tipe pengajuan, dalam bulan.
 *
 * Yang disimpan adalah aturannya, bukan daftar jadinya, sehingga tidak mungkin
 * ada daftar yang diam-diam bertentangan dengan batas maksimalnya.
 *
 * Mobil memakai kelipatan lebih kasar karena nominalnya jauh lebih besar dan
 * tenornya jarang ditawar per beberapa bulan. Batas 24 bulan berlaku untuk
 * seluruh tipe, sesuai soal.
 */
export const TENOR_RULES: Record<
  ApplicationType,
  { step: number; max: number }
> = {
  MOTORCYCLE: { step: 3, max: 24 },
  CAR: { step: 6, max: 24 },
  MULTIPURPOSE: { step: 3, max: 24 },
};

/** Daftar tenor yang boleh dipilih untuk sebuah tipe pengajuan. */
export function tenorOptionsFor(type: ApplicationType): number[] {
  const { step, max } = TENOR_RULES[type];

  return Array.from(
    { length: Math.floor(max / step) },
    (_, index) => (index + 1) * step,
  );
}

/**
 * Batas yang berlaku pada titik persetujuan. Soal menuliskannya sebagai "nominal
 * maksimal pinjaman yang dapat disetujui", sehingga penegakannya berada pada aksi
 * menyetujui, bukan hanya pada form. Batas yang sama juga dicegah saat pengisian
 * demi kenyamanan, tetapi aksi persetujuan tetap memeriksanya sendiri agar data
 * yang tidak melewati form pun tidak lolos.
 */
export const MAX_APPROVABLE_AMOUNT = 200_000_000;
export const MAX_APPROVABLE_TENOR_MONTHS = 24;

/**
 * Pendapatan bulanan minimum agar nasabah dapat mengajukan. Diperiksa pada saat
 * pengisian, sesuai bunyi soal "ketika menambahkan data pengajuan baru".
 */
export const MIN_MONTHLY_INCOME = 1_000_000;

/**
 * Batas jumlah pengajuan per nasabah.
 *
 * Soal menuliskannya sebagai "maksimal pengajuan nasabah adalah sebanyak 3 kali"
 * tanpa menjelaskan apakah yang dihitung seluruh pengajuan atau hanya yang masih
 * berjalan. Yang dipakai di sini adalah bacaan harfiahnya: seluruh pengajuan
 * milik nasabah tersebut, apa pun statusnya.
 */
export const MAX_APPLICATIONS_PER_CUSTOMER = 3;

/**
 * Suku bunga flat per tahun, dibedakan menurut tipe pengajuan: kendaraan roda
 * dua berisiko lebih tinggi daripada roda empat, dan multiguna tidak beragunan
 * kendaraan sehingga paling tinggi.
 *
 * Besarannya diperkirakan dari simulator publik CMD Finance, yang pada pinjaman
 * motor menunjukkan biaya setara sekitar 50-64% per tahun dan pada mobil sekitar
 * 33% per tahun. Angka di bawah ini lebih rendah karena hanya mewakili bunga,
 * sementara simulator mereka sudah termasuk biaya admin.
 *
 * Angka ini tetap ilustratif dan bukan suku bunga resmi CMD Finance: rumus asli
 * mereka dihitung di server dan tidak dipublikasikan. Pada sistem produksi suku
 * bunga wajib disimpan per pengajuan, karena rate berubah seiring waktu dan
 * angsuran pengajuan lama tidak boleh ikut berubah saat rate baru berlaku.
 */
export const INTEREST_RATE_PER_YEAR: Record<ApplicationType, number> = {
  MOTORCYCLE: 0.24,
  CAR: 0.15,
  MULTIPURPOSE: 0.3,
};
