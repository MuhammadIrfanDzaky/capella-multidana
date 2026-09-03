"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/applications", label: "Daftar Pengajuan" },
  { href: "/applications/new", label: "Pengajuan Baru" },
];

// Dipisahkan dari AppHeader agar hanya bagian ini yang menjadi komponen client.
export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama">
      <ul className="-mx-3 flex items-center gap-1">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-10 items-center border-b-2 px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900 sm:h-16 sm:text-base ${
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
