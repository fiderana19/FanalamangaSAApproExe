import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png";
import type {
  UpdateInfoInterface,
  UpdateProgressInterface,
  UpdateStatus,
} from "@/hooks/useUpdater";

const formatBytes = (value: number): string => {
  if (!value || value <= 0) return "0 Mo";
  const mo = value / (1024 * 1024);
  if (mo >= 1) return `${mo.toFixed(1)} Mo`;
  return `${(value / 1024).toFixed(0)} Ko`;
};

const formatSpeed = (bytesPerSecond: number): string =>
  `${formatBytes(bytesPerSecond)}/s`;

interface UpdateDownloadPageProps {
  open: boolean;
  status: UpdateStatus;
  info: UpdateInfoInterface;
  progress: UpdateProgressInterface | null;
  error: string | null;
  appVersion?: string;
  onRetry: () => void;
}

const UpdateDownloadPage = ({
  open,
  status,
  info,
  progress,
  error,
  appVersion,
  onRetry,
}: UpdateDownloadPageProps) => {
  if (!open) return null;

  const percent = Math.min(100, Math.max(0, Math.round(progress?.percent ?? 0)));
  const isInstalling = status === "downloaded" || status === "installing";
  const hasError = status === "error";

  const title = hasError
    ? "Échec du téléchargement"
    : isInstalling
      ? "Installation de la mise à jour"
      : "Téléchargement de la mise à jour";

  return createPortal(
    <div
      className='fixed inset-0 z-[80] flex items-center justify-center bg-brand-bg p-4'
      role='dialog'
      aria-live='polite'
    >
      <div className='w-full max-w-md rounded-2xl border border-brand-border bg-white px-8 py-9 text-center shadow-2xl'>
        <img
          src={FanalamangaLogo}
          alt='Logo Fanalamanga'
          className='mx-auto size-20 object-contain drop-shadow-sm'
        />

        <h1 className='mt-5 text-lg font-bold text-brand'>FANALAMANGA S.A</h1>
        <p className='mt-1 text-sm font-medium text-foreground'>{title}</p>
        <p className='mt-1 text-xs text-brand-muted'>Application d'Approvisionnement</p>

        {appVersion && info.version && (
          <p className='mt-4 text-xs text-brand-muted'>
            Version {appVersion} →{" "}
            <span className='font-semibold text-foreground'>{info.version}</span>
          </p>
        )}

        {hasError ? (
          <>
            <p className='mt-5 text-xs text-red-600'>{error}</p>
            <div className='mt-5 flex justify-center'>
              <Button variant='brand' onClick={onRetry}>
                Réessayer
              </Button>
            </div>
          </>
        ) : isInstalling ? (
          <div className='mt-6 flex flex-col items-center gap-3'>
            <Loader2 className='size-7 animate-spin text-brand' />
            <p className='text-xs text-brand-muted'>
              Veuillez patienter, l'application va redémarrer.
            </p>
          </div>
        ) : (
          <div className='mt-6'>
            <div className='h-2.5 w-full overflow-hidden rounded-full bg-brand/10'>
              <div
                className='h-full rounded-full bg-brand transition-all duration-200'
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className='mt-2 flex items-center justify-between text-xs text-brand-muted'>
              <span>{percent}%</span>
              {progress && progress.total > 0 && (
                <span>
                  {formatBytes(progress.transferred)} / {formatBytes(progress.total)}
                </span>
              )}
            </div>
            {progress && progress.bytesPerSecond > 0 && (
              <p className='mt-1 text-[11px] text-brand-muted'>
                {formatSpeed(progress.bytesPerSecond)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default UpdateDownloadPage;
