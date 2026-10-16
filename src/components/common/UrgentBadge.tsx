import React from "react";
import { Zap } from "lucide-react";

interface UrgentBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

const UrgentBadge: React.FC<UrgentBadgeProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClass = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";
  const iconClass = size === "md" ? "size-4" : "size-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 font-semibold text-red-600 ${sizeClass} ${className}`}
    >
      <Zap className={iconClass} /> Urgent
    </span>
  );
};

export default UrgentBadge;
