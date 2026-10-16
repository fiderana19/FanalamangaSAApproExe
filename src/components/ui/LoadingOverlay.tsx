import React from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  open: boolean;
  title?: string;
  description?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  title = "Traitement en cours…",
  description,
}) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center p-4'
      role='status'
      aria-live='polite'
    >
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      <div className='relative flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-brand-border bg-white px-8 py-7 shadow-2xl'>
        <div className='grid size-16 place-items-center rounded-full bg-brand/10 ring-8 ring-brand/5'>
          <Loader2 className='size-8 text-brand animate-spin' />
        </div>
        <div className='text-center'>
          <p className='text-sm font-semibold text-foreground'>{title}</p>
          {description && (
            <p className='mt-1 text-xs text-brand-muted'>{description}</p>
          )}
        </div>
        <div className='flex items-center gap-1.5'>
          <span className='size-1.5 rounded-full bg-brand animate-bounce' />
          <span className='size-1.5 rounded-full bg-brand animate-bounce [animation-delay:150ms]' />
          <span className='size-1.5 rounded-full bg-brand animate-bounce [animation-delay:300ms]' />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LoadingOverlay;
