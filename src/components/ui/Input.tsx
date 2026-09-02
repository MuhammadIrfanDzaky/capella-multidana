"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  ERROR_CLASS,
  HINT_CLASS,
  LABEL_CLASS,
  SINGLE_LINE_FIELD,
  fieldClassName,
} from "./fieldStyles";

type InputProps = ComponentPropsWithRef<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`${fieldClassName(Boolean(error))} ${SINGLE_LINE_FIELD}`}
        {...props}
      />
      {error ? (
        <p id={messageId} className={ERROR_CLASS}>
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className={HINT_CLASS}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
