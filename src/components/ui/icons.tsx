import type { SVGProps } from "react";

const BASE_PROPS: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function EyeIcon() {
  return (
    <svg {...BASE_PROPS}>
      <path d="M1.5 8s2.4-4 6.5-4 6.5 4 6.5 4-2.4 4-6.5 4S1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="1.75" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...BASE_PROPS}>
      <path d="m3 8.5 3.25 3.25L13 5" />
    </svg>
  );
}

export function CrossIcon() {
  return (
    <svg {...BASE_PROPS}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg {...BASE_PROPS}>
      <path d="M13 8H3M6.5 4.5 3 8l3.5 3.5" />
    </svg>
  );
}
