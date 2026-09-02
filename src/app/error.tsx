"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

/**
 * Batas galat untuk seluruh halaman. Next.js merender komponen ini ketika terjadi
 * kesalahan yang tidak tertangani, menggantikan halaman yang gagal dirender.
 *
 * Pesan asli sengaja tidak ditampilkan kepada pengguna: isinya bisa memuat detail
 * basis data. Yang ditampilkan hanya kode ringkas dari Next.js agar galat di layar
 * dapat dicocokkan dengan catatan di server.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        Terjadi kesalahan
      </h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        Halaman ini gagal dimuat. Coba muat ulang; bila tetap gagal, hubungi tim
        teknis.
      </p>

      {error.digest ? (
        <p className="mt-4 text-sm text-slate-500">
          Kode galat: <span className="tabular-nums">{error.digest}</span>
        </p>
      ) : null}

      <div className="mt-6 flex justify-center">
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </div>
  );
}
