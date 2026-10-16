import React from "react";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) =>
  icon ? (
    <div className='flex items-center gap-2.5 pb-2 mb-3 text-gray-700'>
      {icon}
      <h3 className='text-sm font-bold'>{title}</h3>
    </div>
  ) : (
    <div className='pb-2 mb-3 text-gray-700'>
      <h3 className='text-sm font-bold'>{title}</h3>
    </div>
  );

export default SectionHeader;