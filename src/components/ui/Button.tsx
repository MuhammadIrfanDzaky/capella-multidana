import type { ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "md" | "sm";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// Teks di atas gold harus hitam: putih di atasnya hanya ~1.8:1 dan gagal terbaca.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-ink hover:bg-brand-600",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-base",
  sm: "h-9 px-3 text-sm",
};

/** Dipakai tautan yang berperan sebagai tombol, agar tampilannya tidak disalin. */
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
