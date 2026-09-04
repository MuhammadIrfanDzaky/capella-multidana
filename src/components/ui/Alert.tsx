import type { ReactNode } from "react";

import { AlertTriangleIcon, CheckCircleIcon, CrossIcon } from "./icons";
import { TONE_SURFACE } from "./tones";

type AlertTone = "success" | "danger";

type AlertProps = {
  tone: AlertTone;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
};

const TONE_ICON = {
  success: CheckCircleIcon,
  danger: AlertTriangleIcon,
} as const;

/**
 * Hanya menentukan rupanya. Penempatannya diserahkan kepada pemanggil, karena
 * pesan yang sama dapat duduk di dalam alur halaman maupun mengambang di atasnya.
 */
export function Alert({ tone, title, children, onDismiss }: AlertProps) {
  const Icon = TONE_ICON[tone];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${TONE_SURFACE[tone]}`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-0.5 text-sm">{children}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pemberitahuan"
          className="-mr-1 -mt-0.5 shrink-0 rounded p-1 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <CrossIcon />
        </button>
      ) : null}
    </div>
  );
}
