import type { ReactNode } from "react";

import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

/**
 * Dipakai ketika sebuah daftar benar-benar kosong. Tabel tanpa baris tidak
 * membedakan "belum ada data" dari "gagal memuat", sehingga keadaan itu perlu
 * dinyatakan dengan kalimat, bukan dengan ruang kosong.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-slate-300 px-6 py-14 text-center">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
