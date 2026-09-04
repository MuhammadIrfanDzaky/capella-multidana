import type { ReactNode } from "react";

import { TONE_SURFACE, type Tone } from "./tones";

export type BadgeTone = Tone;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium whitespace-nowrap ${TONE_SURFACE[tone]}`}
    >
      {children}
    </span>
  );
}
