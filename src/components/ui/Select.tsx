"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  ERROR_CLASS,
  LABEL_CLASS,
  SINGLE_LINE_FIELD,
  fieldClassName,
} from "./fieldStyles";

type SelectProps = ComponentPropsWithRef<"select"> & {
  label: string;
  error?: string;
};

export function Select({ label, error, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={`${fieldClassName(Boolean(error))} ${SINGLE_LINE_FIELD}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={messageId} className={ERROR_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
