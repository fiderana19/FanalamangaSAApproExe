import React from "react";
import {
  LIGNE_BON_MAGASIN_STATUTS,
  LIGNE_BON_MAGASIN_STATUT_LABELS,
  getLigneBonMagasinStatutMeta,
} from "@/constants/BonMagasinStatut";

interface LigneBonMagasinStatutBadgeProps {
  statut?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const LigneBonMagasinStatutBadge: React.FC<LigneBonMagasinStatutBadgeProps> = ({
  statut,
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  if (!statut || !LIGNE_BON_MAGASIN_STATUTS.includes(statut)) {
    return null;
  }

  const meta = getLigneBonMagasinStatutMeta(statut);
  const BadgeIcon = meta.icon;
  const label = LIGNE_BON_MAGASIN_STATUT_LABELS[statut] ?? statut;
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

export default LigneBonMagasinStatutBadge;