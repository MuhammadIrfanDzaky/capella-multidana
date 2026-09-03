import type { ComponentPropsWithRef } from "react";

type CardProps = ComponentPropsWithRef<"section">;

/** Jarak dalam sengaja tidak diatur di sini: tabel butuh nol, panel pesan butuh lapang. */
export function Card({ className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
      {...props}
    />
  );
}
