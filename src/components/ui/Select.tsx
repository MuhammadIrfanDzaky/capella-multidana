"use client";

import { useId, type ComponentPropsWithRef } from "react";

import { fieldClassName } from "./fieldStyles";

type SelectProps = ComponentPropsWithRef<"select"> & {
  label: string;
  error?: string;
};

export function Select({
  label,
  error,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={fieldClassName(Boolean(error))}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={messageId} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
