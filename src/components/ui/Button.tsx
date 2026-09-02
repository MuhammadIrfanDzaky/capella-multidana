import type { ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "md" | "sm";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * Aksi utama memakai gold merek dengan teks hitam. Kombinasi itu mengikuti logo
 * dan memberi kontras sekitar 11:1 — teks putih di atas gold justru gagal
 * terbaca.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-ink hover:bg-brand-600",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

/** Ukuran `sm` dipakai untuk aksi di dalam baris tabel agar barisnya tidak melar. */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-base",
  sm: "h-9 px-3 text-sm",
};

/**
 * Diekspor supaya tautan yang berperan sebagai aksi utama, misalnya "Ajukan
 * Baru", tampil identik dengan tombol tanpa menyalin daftar kelasnya.
 */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
) {
  return `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClassName(variant, size)} ${className}`}
      {...props}
    />
  );
}
