/** Lebar isi halaman, dipilih menurut jenis isi dan bukan per halaman. */
/**
 * Label tombol aksi disembunyikan hanya bila layar lebar DAN penunjuknya presisi,
 * sehingga perangkat sentuh — termasuk laptop layar sentuh — tetap mendapat teks.
 * Bila varian `pointer-fine` tidak didukung, kelas ini diabaikan dan teks tetap
 * tampil, sehingga kegagalannya mengarah ke keadaan yang aman.
 */
export const COMPACT_ACTION_LABEL = "lg:pointer-fine:hidden";

export const CONTENT_WIDTH = {
  message: "mx-auto max-w-xl",
  page: "mx-auto max-w-5xl",
} as const;
