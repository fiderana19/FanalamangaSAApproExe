import React from 'react';
import { cn } from '@/lib/utils';

interface PageActionBarProps {
  children: React.ReactNode;
  className?: string;
}

const PageActionBar: React.FC<PageActionBarProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-[9999] flex items-center gap-3',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageActionBar;