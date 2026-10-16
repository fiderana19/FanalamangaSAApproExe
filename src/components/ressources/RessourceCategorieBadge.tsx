import React from "react";
import { CATEGORIES, CATEGORIE_LABELS, getCategorieMeta } from "@/constants/RessourceCategorie";

interface RessourceCategorieBadgeProps {
  categorie?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const RessourceCategorieBadge: React.FC<RessourceCategorieBadgeProps> = ({
  categorie,
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  if (!categorie || !CATEGORIES.includes(categorie)) {
    return null;
  }

  const meta = getCategorieMeta(categorie);
  const BadgeIcon = meta.icon;
  const label = CATEGORIE_LABELS[categorie] ?? categorie;
  const sizeClass = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";
  const iconClass = size === "md" ? "size-4" : "size-3.5";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${meta.badge} ${className}`}
    >
      {showIcon && <BadgeIcon className={iconClass} />}
      {label}
    </span>
  );
};

export default RessourceCategorieBadge;
