"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * Dibangun di atas elemen `<dialog>` bawaan peramban, bukan div bertumpuk.
 * Dengan `showModal()`, peramban sudah menyediakan penguncian fokus di dalam
 * dialog, penutupan lewat tombol Escape, dan penonaktifan konten di belakangnya —
 * tanpa satu pun dependensi tambahan.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // `close` ikut terpanggil saat pengguna menekan Escape, sehingga status di
      // komponen induk tetap selaras dengan keadaan dialog yang sebenarnya.
      onClose={onClose}
      onClick={(event) => {
        // Klik yang mendarat pada elemen dialog itu sendiri berarti mengenai
        // latar gelapnya, karena seluruh isi berada di dalam elemen anak.
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-slate-200 p-0 text-slate-900 backdrop:bg-slate-900/50"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>

        <div className="mt-3 text-slate-700">{children}</div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
      </div>
    </dialog>
  );
}
