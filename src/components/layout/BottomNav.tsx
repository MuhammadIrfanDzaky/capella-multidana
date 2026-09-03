"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "./navLinks";

/**
 * Navigasi bawah untuk ponsel dan tablet kecil, tempat tepi bawah layar paling
 * mudah dijangkau ibu jari. Pada `md` ke atas navigasinya kembali ke header.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900 ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 bg-brand-500"
                  />
                ) : null}

                <Icon className={isActive ? "size-6 text-brand-600" : "size-6"} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
