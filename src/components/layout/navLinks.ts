import { FilePlusIcon, ListIcon } from "@/components/ui/icons";

/** Dipakai bersama oleh navigasi header dan navigasi bawah. */
export const NAV_LINKS = [
  { href: "/applications", label: "Daftar Pengajuan", Icon: ListIcon },
  { href: "/applications/new", label: "Pengajuan Baru", Icon: FilePlusIcon },
] as const;

/**
 * Halaman detail berada di bawah `/applications`, jadi pencocokan persis membuat
 * navigasi kehilangan penanda halaman aktif saat pengajuan dibuka. Yang menang
 * adalah tautan dengan awalan terpanjang, supaya `/applications/new` tetap
 * menandai dirinya sendiri, bukan daftarnya.
 */
export function isNavLinkActive(pathname: string, href: string) {
  const matched = NAV_LINKS.map((link) => link.href)
    .filter(
      (candidate) =>
        pathname === candidate || pathname.startsWith(`${candidate}/`),
    )
    .sort((a, b) => b.length - a.length);

  return matched[0] === href;
}
