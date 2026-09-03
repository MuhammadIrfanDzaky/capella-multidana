import { FilePlusIcon, ListIcon } from "@/components/ui/icons";

/** Dipakai bersama oleh navigasi header dan navigasi bawah. */
export const NAV_LINKS = [
  { href: "/applications", label: "Daftar Pengajuan", Icon: ListIcon },
  { href: "/applications/new", label: "Pengajuan Baru", Icon: FilePlusIcon },
] as const;
