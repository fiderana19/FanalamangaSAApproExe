import React from "react";
import {
  DEMANDE_ACHAT_STATUTS,
  getDemandeAchatStatutLabel,
  getDemandeAchatStatutMeta,
} from "@/constants/DemandeAchatStatut";

interface DemandeAchatStatutBadgeProps {
  statut?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const DemandeAchatStatutBadge: React.FC<DemandeAchatStatutBadgeProps> = ({
  statut,
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  if (!statut || !DEMANDE_ACHAT_STATUTS.includes(statut)) {
    return null;
  }

  const meta = getDemandeAchatStatutMeta(statut);
  const BadgeIcon = meta.icon;
  const label = getDemandeAchatStatutLabel(statut);
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

export default DemandeAchatStatutBadge;
