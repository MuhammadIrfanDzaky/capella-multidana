import Link from "next/link";

import { buttonClassName } from "@/components/ui/Button";

/**
 * Menggantikan halaman 404 bawaan Next.js yang berbahasa Inggris. Dipakai baik
 * untuk alamat yang tidak dikenal maupun ketika halaman detail memanggil
 * `notFound()` karena pengajuan tidak ada.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        Halaman tidak ditemukan
      </h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        Alamat yang dibuka tidak tersedia, atau pengajuan yang dituju sudah tidak
        ada.
      </p>

      <div className="mt-6 flex justify-center">
        <Link href="/applications" className={buttonClassName()}>
          Kembali ke Daftar Pengajuan
        </Link>
      </div>
    </div>
  );
}
