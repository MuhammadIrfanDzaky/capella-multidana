"use client";

import { useId, type ComponentPropsWithRef } from "react";

import { formatThousands } from "@/lib/format";

import {
  ERROR_CLASS,
  LABEL_CLASS,
  SINGLE_LINE_FIELD,
  fieldClassName,
} from "./fieldStyles";

/** `digits` untuk nomor identitas, `rupiah` untuk nilai uang. */
type FieldFormat = "digits" | "rupiah";

type InputProps = ComponentPropsWithRef<"input"> & {
  label: string;
  error?: string;
  format?: FieldFormat;
};

/**
 * Posisi kursor wajib dikembalikan: tanpa itu, menyunting digit di tengah angka
 * akan melempar kursor ke ujung kanan setiap kali pemisah ribuan bergeser.
 */
function reformatInPlace(input: HTMLInputElement, format: FieldFormat) {
  const caret = input.selectionStart ?? input.value.length;
  const digitsBeforeCaret = input.value
    .slice(0, caret)
    .replace(/\D/g, "").length;

  const next =
    format === "rupiah"
      ? formatThousands(input.value)
      : input.value.replace(/\D/g, "");

  if (next === input.value) {
    return;
  }

  input.value = next;

  let position = 0;
  let digitsSeen = 0;

  while (position < next.length && digitsSeen < digitsBeforeCaret) {
    if (/\d/.test(next[position])) {
      digitsSeen += 1;
    }

    position += 1;
  }

  input.setSelectionRange(position, position);
}

export function Input({
  label,
  error,
  id,
  format,
  onChange,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const isRupiah = format === "rupiah";

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className={LABEL_CLASS}>
        {label}
      </label>
      <div className="relative">
        {/* Satuan ditampilkan sebagai hiasan, bukan bagian dari nilai, agar tidak
            perlu dikupas ulang saat divalidasi. */}
        {isRupiah ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500"
          >
            Rp
          </span>
        ) : null}

        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          className={`${fieldClassName(Boolean(error))} ${SINGLE_LINE_FIELD} ${
            isRupiah ? "pl-11" : ""
          }`}
          onChange={(event) => {
            // Nilai dirapikan sebelum penangan milik pemanggil dijalankan, agar
            // yang tersimpan di state form sama dengan yang terlihat pengguna.
            if (format) {
              reformatInPlace(event.target, format);
            }

            onChange?.(event);
          }}
          {...props}
        />
      </div>
      {error ? (
        <p id={messageId} className={ERROR_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
