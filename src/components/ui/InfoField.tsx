import React from "react";

interface InfoFieldProps {
  label: string;
  children: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, children }) => (
  <div className='min-w-0'>
    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>{label}</div>
    <div className='text-sm text-gray-700 truncate'>{children}</div>
  </div>
);

export default InfoField;