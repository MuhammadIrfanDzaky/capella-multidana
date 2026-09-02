import type { ComponentPropsWithRef } from "react";

type CardProps = ComponentPropsWithRef<"section">;

/**
 * Wadah putih ber-border yang dipakai sebagai pembagi utama antar bagian.
 *
 * Jarak dalam sengaja tidak ditetapkan di sini: tabel membutuhkan nol, panel
 * pesan membutuhkan ruang yang lapang. Yang disatukan hanyalah bagian yang
 * memang harus seragam, yaitu sudut, garis tepi, dan warna latar.
 */
export function Card({ className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
      {...props}
    />
  );
}
