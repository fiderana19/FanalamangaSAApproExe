import React from "react";
import {
  LIGNE_STATUTS,
  LIGNE_STATUT_LABELS,
  getLigneStatutMeta,
} from "@/constants/DemandeStatut";

interface LigneStatutBadgeProps {
  statut?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const LigneStatutBadge: React.FC<LigneStatutBadgeProps> = ({
  statut,
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  if (!statut || !LIGNE_STATUTS.includes(statut)) {
    return null;
  }

  const meta = getLigneStatutMeta(statut);
  const BadgeIcon = meta.icon;
  const label = LIGNE_STATUT_LABELS[statut] ?? statut;
  const sizeClass = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";
  const iconClass = size === "md" ? "size-4" : "size-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${meta.badge} ${className}`}
    >
      {showIcon && <BadgeIcon className={iconClass} />}
      {label}
    </span>
  );
};

export default LigneStatutBadge;