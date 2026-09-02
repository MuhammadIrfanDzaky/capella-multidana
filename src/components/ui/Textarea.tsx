"use client";

import { useId, type ComponentPropsWithRef } from "react";

import {
  ERROR_CLASS,
  HINT_CLASS,
  LABEL_CLASS,
  fieldClassName,
} from "./fieldStyles";

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
    <div className="space-y-2">
      <label htmlFor={textareaId} className={LABEL_CLASS}>
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`${fieldClassName(Boolean(error))} min-h-28 py-2.5`}
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
