import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  value?: string;
  variant?: "plain" | "badge";
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, value, variant = "badge" }) => (
  <div className='flex items-center gap-3'>
    {variant === "badge" ? (
      <div className='grid place-items-center size-12 rounded-lg bg-brand/10 text-brand shrink-0'>
        {icon}
      </div>
    ) : (
      <span className='text-gray-500 shrink-0'>{icon}</span>
    )}
    <span className='text-sm font-medium text-foreground break-words min-w-0'>
      {value}
    </span>
  </div>
);

export default InfoItem;