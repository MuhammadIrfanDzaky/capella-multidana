"use client";

import { useId, type ComponentPropsWithRef } from "react";

import { fieldClassName } from "./fieldStyles";

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Textarea({ label, error, hint, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={fieldClassName(Boolean(error))}
        {...props}
      />
      {error ? (
        <p id={messageId} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
