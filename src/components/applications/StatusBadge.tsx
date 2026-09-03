import { Badge, type BadgeTone } from "@/components/ui/Badge";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants";

// Gold merek sengaja dihindari agar tidak tertukar dengan identitas aplikasi.
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
