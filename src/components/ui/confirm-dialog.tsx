import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExclamationCircleOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  tone?: "danger" | "brand";
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  warning,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loadingLabel = "Traitement…",
  loading = false,
  icon,
  tone = "danger",
  confirmVariant = "destructive",
  onConfirm,
  onCancel,
}) => {
  const [render, setRender] = useState<boolean>(open);
  const [show, setShow] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(loading);
  const titleId = useId();
  const descriptionId = useId();

  onCancelRef.current = onCancel;
  loadingRef.current = loading;

  useEffect(() => {
    if (open) {
      setRender(true);
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }
    setShow(false);
    const timer = setTimeout(() => setRender(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!render) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loadingRef.current) {
        onCancelRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [render]);

  if (!render) {
    return null;
  }

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          if (!loading) {
            onCancel();
          }
        }}
      />
      <div
        role='alertdialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`relative w-full max-w-md rounded-lg border border-brand-border bg-white p-6 shadow-xl transition-all duration-200 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className='flex gap-4'>
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
              tone === "brand" ? "bg-brand/10 text-brand" : "bg-red-50 text-red-600"
            }`}
          >
            {icon ?? <ExclamationCircleOutlined className='text-lg' />}
          </div>
          <div className='flex-1'>
            <h2 id={titleId} className='text-base font-semibold text-foreground'>
              {title}
            </h2>
            <p id={descriptionId} className='mt-1 text-sm text-muted-foreground'>
              {description}
            </p>
            {warning && (
              <p className='mt-2 flex items-start gap-1.5 text-xs text-red-600'>
                <InfoCircleOutlined className='mt-0.5 shrink-0' />
                <span>{warning}</span>
              </p>
            )}
          </div>
        </div>
        <div className='mt-6 flex justify-end gap-3'>
          <Button
            ref={cancelRef}
            variant='outline'
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingOutlined /> {loadingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
