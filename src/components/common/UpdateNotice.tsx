import { DownloadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png";

interface UpdateNoticeProps {
  visible: boolean;
  version?: string;
  onUpdate: () => void;
  onLater: () => void;
}

const UpdateNotice = ({ visible, version, onUpdate, onLater }: UpdateNoticeProps) => {
  if (!visible) return null;

  return (
    <div className='fixed bottom-5 right-5 z-[70] w-[340px] rounded-2xl border border-brand-border bg-white p-4 shadow-2xl'>
      <div className='flex items-start gap-3'>
        <img
          src={FanalamangaLogo}
          alt='Logo Fanalamanga'
          className='size-9 rounded-lg object-contain'
        />
        <div className='flex-1'>
          <p className='text-sm font-semibold text-foreground'>Mise à jour disponible</p>
          <p className='mt-0.5 text-xs text-brand-muted'>
            {version
              ? `La version ${version} est disponible.`
              : "Une nouvelle version est disponible."}
          </p>
        </div>
        <button
          type='button'
          aria-label='Fermer la notification'
          onClick={onLater}
          className='text-brand-muted transition-colors hover:text-foreground'
        >
          <XIcon className='size-4' />
        </button>
      </div>

      <div className='mt-3 flex items-center justify-end gap-2'>
        <Button variant='ghost' size='sm' onClick={onLater}>
          Plus tard
        </Button>
        <Button variant='brand' size='sm' onClick={onUpdate}>
          <DownloadIcon />
          Mettre à jour
        </Button>
      </div>
    </div>
  );
};

export default UpdateNotice;
