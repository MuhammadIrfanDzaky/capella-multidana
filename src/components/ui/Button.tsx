import type { ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
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
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
