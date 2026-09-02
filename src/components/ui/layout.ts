/**
 * Lebar isi halaman. Ketiganya dipilih menurut jenis isi, bukan menurut selera
 * per halaman: teks satu kolom butuh baris yang pendek agar nyaman dibaca,
 * sedangkan data berpasangan label-nilai butuh ruang lebih.
 *
 * Dikumpulkan di sini supaya angka-angka ini tidak terlihat sembarangan ketika
 * tersebar di banyak berkas.
 */
export const CONTENT_WIDTH = {
  /** Panel pesan pendek: galat dan halaman tidak ditemukan. */
  message: "mx-auto max-w-xl",
  /** Form dua kolom dan halaman detail: keduanya butuh ruang yang sama. */
  page: "mx-auto max-w-3xl",
} as const;
