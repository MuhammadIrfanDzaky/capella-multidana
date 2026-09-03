"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "./navLinks";

// Dipisahkan dari AppHeader agar hanya bagian ini yang menjadi komponen client.
export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="max-md:hidden">
      <ul className="-mr-3 flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-16 items-center border-b-2 px-3 font-medium transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900 ${
                  isActive
                    ? "border-brand-500 text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
