"use client";

import { useId, type ComponentPropsWithRef } from "react";

import { ERROR_CLASS, LABEL_CLASS, fieldClassName } from "./fieldStyles";

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={textareaId} className={LABEL_CLASS}>
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={`${fieldClassName(Boolean(error))} min-h-20 py-2.5`}
        {...props}
      />
      {error ? (
        <p id={messageId} className={ERROR_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
