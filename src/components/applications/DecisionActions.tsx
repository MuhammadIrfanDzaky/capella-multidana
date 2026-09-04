"use client";

import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { CheckIcon, CrossIcon } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";
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

// Hanya bagian ini yang perlu menjadi komponen client; tabel dan halaman detail
// tetap dirender di server.
export function DecisionActions({
  applicationId,
  customerName,
  amount,
  size = "md",
}: DecisionActionsProps) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Penolakan menutup selagi pending diserahkan sepenuhnya kepada `Dialog`.
  // Menjaganya di dua tempat justru membuat state React dan elemen bawaan
  // dapat berbeda pendapat.
  function closeDialog() {
    setDecision(null);
    setNote("");
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
            : await rejectApplication(applicationId, note);

        if (result.ok) {
          closeDialog();
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

  // Ukuran `sm` hanya dipakai di dalam tabel, yang sendirinya baru tampil pada
  // layar lebar. Di sana tombolnya cukup ikon beserta tooltip; di kartu dan
  // halaman detail namanya selalu ditulis.
  const compact = size === "sm";

  function withTooltip(label: string, action: ReactNode) {
    return compact ? <Tooltip label={label}>{action}</Tooltip> : action;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {withTooltip(
          "Setujui",
          <Button
            size={size}
            onClick={() => setDecision("APPROVED")}
            aria-label={`Setujui pengajuan ${customerName}`}
          >
            <CheckIcon />
            {compact ? null : "Setujui"}
          </Button>,
        )}

        {withTooltip(
          "Tolak",
          <Button
            size={size}
            variant="danger"
            onClick={() => setDecision("REJECTED")}
            aria-label={`Tolak pengajuan ${customerName}`}
          >
            <CrossIcon />
            {compact ? null : "Tolak"}
          </Button>,
        )}
      </div>

      {copy ? (
        <Dialog
          open
          onClose={closeDialog}
          dismissible={!isPending}
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

          {/* Hanya penolakan yang menuntut penjelasan. Tidak diwajibkan, karena
              sebagian penolakan sudah jelas dari datanya sendiri. */}
          {decision === "REJECTED" ? (
            <div className="mt-4">
              <Textarea
                label="Alasan Penolakan (Opsional)"
                rows={3}
                maxLength={500}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={isPending}
              />
            </div>
          ) : null}

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
