import Link from "next/link";

import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CONTENT_WIDTH } from "@/components/ui/layout";
import { PAGE_TITLE_CLASS } from "@/components/ui/typography";

/**
 * Menggantikan halaman 404 bawaan Next.js yang berbahasa Inggris. Dipakai baik
 * untuk alamat yang tidak dikenal maupun ketika halaman detail memanggil
 * `notFound()` karena pengajuan tidak ada.
 */
export default function NotFound() {
  return (
    <Card className={`${CONTENT_WIDTH.message} px-6 py-14 text-center`}>
      <h1 className={PAGE_TITLE_CLASS}>Halaman tidak ditemukan</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        Alamat yang dibuka tidak tersedia, atau pengajuan yang dituju sudah tidak
        ada.
      </p>

      <div className="mt-6 flex justify-center">
        <Link href="/applications" className={buttonClassName()}>
          Kembali ke Daftar Pengajuan
        </Link>
      </div>
    </Card>
  );
}
