import type { ReactNode } from "react";

/**
 * Hanya tampil pada layar lebar dengan penunjuk presisi, yaitu keadaan yang sama
 * ketika label tombol disembunyikan. Isinya `aria-hidden` karena tombol yang
 * dibungkus sudah membawa `aria-label` sendiri.
 *
 * Munculnya diatur `.tooltip-anchor` di `globals.css`, yang menanggapi hover
 * maupun fokus papan ketik.
 */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="tooltip-anchor relative inline-flex">
      {children}

      <span
        aria-hidden="true"
        className="tooltip-bubble pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white"
      >
        {label}
        <span className="absolute top-full left-1/2 -mt-1 size-2 -translate-x-1/2 rotate-45 bg-slate-900" />
      </span>
    </span>
  );
}
