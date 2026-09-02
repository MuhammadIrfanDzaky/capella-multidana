import { Badge, type BadgeTone } from "@/components/ui/Badge";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants";

/**
 * Gold merek sengaja tidak dipakai di sini. Bila status "Menunggu" berwarna
 * kuning, warnanya tertukar dengan identitas aplikasi dan berhenti bermakna
 * sebagai penanda status.
 *
 * Warna selalu disertai teks, sehingga status tetap terbaca tanpa bergantung
 * pada kemampuan membedakan warna.
 */
const STATUS_TONE: Record<ApplicationStatus, BadgeTone> = {
  PENDING: "neutral",
  APPROVED: "success",
  REJECTED: "danger",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]}>{APPLICATION_STATUS_LABELS[status]}</Badge>
  );
}
