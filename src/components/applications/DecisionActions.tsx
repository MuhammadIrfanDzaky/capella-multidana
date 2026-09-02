"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatRupiah } from "@/lib/format";
import {
  approveApplication,
  rejectApplication,
} from "@/server/actions/applications";

type Decision = "APPROVED" | "REJECTED";

const DECISION_COPY = {
  APPROVED: {
    title: "Setujui pengajuan ini?",
    verb: "disetujui",
    confirmLabel: "Ya, Setujui",
    confirmVariant: "primary",
  },
  REJECTED: {
    title: "Tolak pengajuan ini?",
    verb: "ditolak",
    confirmLabel: "Ya, Tolak",
    confirmVariant: "danger",
  },
} as const;

type DecisionActionsProps = {
  applicationId: number;
  customerName: string;
  amount: number;
  size?: "sm" | "md";
};

/**
 * Hanya bagian inilah yang menjadi komponen client. Tabel dan halaman detail
 * tetap dirender di server; yang membutuhkan status di peramban hanyalah dialog
 * konfirmasi.
 */
export function DecisionActions({
  applicationId,
  customerName,
  amount,
  size = "sm",
}: DecisionActionsProps) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function closeDialog() {
    // Dialog tidak boleh ditutup selagi keputusan sedang dikirim, agar pengguna
    // tidak kehilangan pesan galat yang mungkin muncul.
    if (isPending) {
      return;
    }

    setDecision(null);
    setError(null);
  }

  function submitDecision() {
    if (!decision) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result =
          decision === "APPROVED"
            ? await approveApplication(applicationId)
            : await rejectApplication(applicationId);

        if (result.ok) {
          setDecision(null);
          return;
        }

        setError(result.message);
      } catch {
        // Dialog sengaja dibiarkan terbuka agar pesan ini terbaca dan pengguna
        // dapat mencoba lagi tanpa mengulang dari awal.
        setError("Keputusan gagal dikirim. Periksa sambungan lalu coba lagi.");
      }
    });
  }

  const copy = decision ? DECISION_COPY[decision] : null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size={size} onClick={() => setDecision("APPROVED")}>
          Setujui
        </Button>
        <Button
          size={size}
          variant="danger"
          onClick={() => setDecision("REJECTED")}
        >
          Tolak
        </Button>
      </div>

      {copy ? (
        <Dialog
          open
          onClose={closeDialog}
          title={copy.title}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={closeDialog}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                variant={copy.confirmVariant}
                onClick={submitDecision}
                disabled={isPending}
              >
                {isPending ? "Memproses..." : copy.confirmLabel}
              </Button>
            </>
          }
        >
          <p>
            Pengajuan atas nama{" "}
            <strong className="font-semibold text-slate-900">
              {customerName}
            </strong>{" "}
            sebesar{" "}
            <strong className="font-semibold text-slate-900 tabular-nums">
              {formatRupiah(amount)}
            </strong>{" "}
            akan {copy.verb}. Keputusan ini tidak dapat diubah kembali.
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-900"
            >
              {error}
            </p>
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
}
