import React from "react";

export interface SectionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  icon,
  title,
  description,
  action,
  onClick,
}) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={
      onClick
        ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick();
            }
          }
        : undefined
    }
    className={`flex items-center gap-4 rounded-lg border border-brand-border bg-white p-4 ${
      onClick
        ? "cursor-pointer transition-colors hover:bg-[#e9f5ee]/40 hover:border-brand"
        : ""
    }`}
  >
    <div className='grid place-items-center size-12 rounded-full bg-brand/10 text-brand shrink-0'>
      {icon}
    </div>
    <div className='flex-1 min-w-0'>
      <h4 className='text-sm font-semibold text-foreground'>{title}</h4>
      <p className='mt-1 text-sm text-gray-600'>{description}</p>
    </div>
    {action && <div className='shrink-0'>{action}</div>}
  </div>
);

export default SectionItem;