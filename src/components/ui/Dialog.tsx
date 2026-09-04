"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  /**
   * Saat `false`, dialog menolak ditutup lewat Escape maupun klik latar. Prop
   * ini wajib ada karena `close` bawaan tidak dapat dibatalkan: bila penutupan
   * hanya diabaikan pada `onClose`, elemennya sudah terlanjur tertutup
   * sementara React masih menganggapnya terbuka, dan keduanya tidak pernah
   * kembali sinkron.
   */
  dismissible?: boolean;
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  dismissible = true,
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
      onClose={onClose}
      onCancel={(event) => {
        if (!dismissible) {
          event.preventDefault();
        }
      }}
      onClick={(event) => {
        // Target berupa elemen dialog itu sendiri berarti klik mengenai latarnya.
        if (dismissible && event.target === dialogRef.current) {
          onClose();
        }
      }}
      // `whitespace-normal` wajib eksplisit: meski tampil di lapisan teratas,
      // dialog tetap mewarisi gaya teks dari posisinya di DOM.
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-slate-200 p-0 text-left whitespace-normal text-slate-900 backdrop:bg-slate-900/50"
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
