"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  ERROR_CLASS,
  HINT_CLASS,
  LABEL_CLASS,
  SINGLE_LINE_FIELD,
  fieldClassName,
} from "./fieldStyles";

type SelectProps = ComponentPropsWithRef<"select"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Select({
  label,
  error,
  hint,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`${fieldClassName(Boolean(error))} ${SINGLE_LINE_FIELD}`}
        {...props}
      >
        {children}
      </select>
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
