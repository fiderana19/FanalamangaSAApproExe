import React, { useRef, useState } from "react";
import {
  DownloadOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { DownloadCloudIcon, FolderSync } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import SectionItem, { SectionItemProps } from "@/components/ui/SectionItem";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { downloadBackup, restoreBackup } from "@/api/backup";
import { downloadBlob } from "@/utils/BonMagasinPdf";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";

const formatStamp = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  const message = axiosError?.response?.data?.message;
  if (typeof message === "string" && message.length > 0) {
    return message;
  }
  return fallback;
};

const DonneeItem: React.FC<SectionItemProps> = (props) => (
  <SectionItem {...props} />
);

const GestionDonneesSection: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadConfirmOpen, setIsDownloadConfirmOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await downloadBackup();
      downloadBlob(
        response.data as Blob,
        `sauvegarde-fanalamanga-${formatStamp()}.json`,
      );
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Sauvegarde téléchargée avec succès !",
      });
    } catch (error) {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: getErrorMessage(
          error,
          "Erreur lors du téléchargement de la sauvegarde !",
        ),
      });
    } finally {
      setIsDownloading(false);
      setIsDownloadConfirmOpen(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (file) {
      setPendingFile(file);
    }
  };

  const handleConfirmRestore = async () => {
    if (!pendingFile) {
      return;
    }
    setIsRestoring(true);
    try {
      await restoreBackup(pendingFile);
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Restauration terminée avec succès ! Rechargement…",
      });
      setPendingFile(null);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: getErrorMessage(
          error,
          "Erreur lors de la restauration de la sauvegarde !",
        ),
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-bold text-foreground'>Gestion des données</h2>
      <p className='text-sm text-gray-600'>
        Gérez les données de l’application : téléchargez une copie complète de
        la base de données ou restaurez une sauvegarde existante.
      </p>

      <div className='flex flex-col gap-3'>
        <DonneeItem
          icon={<DownloadCloudIcon className='size-6' />}
          title='Sauvegarde'
          description='Téléchargez une copie complète de la base de données au format JSON.'
          action={
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDownloadConfirmOpen(true)}
              disabled={isDownloading}
            >
              {isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
              Télécharger
            </Button>
          }
        />

        <DonneeItem
          icon={<FolderSync className='size-6' />}
          title='Restauration'
          description='Importez un fichier de sauvegarde pour restaurer les données de la base.'
          action={
            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              disabled={isRestoring}
            >
              {isRestoring ? <LoadingOutlined /> : <UploadOutlined />}
              Restaurer
            </Button>
          }
        />
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='.json,application/json'
        className='hidden'
        onChange={handleFileChange}
      />

      <ConfirmDialog
        open={isDownloadConfirmOpen}
        title='Télécharger la sauvegarde'
        description='Une copie complète de la base de données sera générée puis téléchargée au format JSON.'
        icon={<DownloadOutlined />}
        tone='brand'
        confirmVariant='brand'
        confirmLabel='Télécharger'
        cancelLabel='Annuler'
        loadingLabel='Téléchargement…'
        loading={isDownloading}
        onConfirm={handleDownload}
        onCancel={() => {
          if (!isDownloading) {
            setIsDownloadConfirmOpen(false);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingFile)}
        title='Restaurer une sauvegarde'
        description={
          <>
            Vous êtes sur le point de restaurer <b>{pendingFile?.name}</b>. Cette
            action remplace toutes les données actuelles de la base.
          </>
        }
        warning='Cette opération est irréversible. Assurez-vous d’avoir sauvegardé la base actuelle.'
        confirmLabel='Restaurer'
        loadingLabel='Restauration…'
        loading={isRestoring}
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          if (!isRestoring) {
            setPendingFile(null);
          }
        }}
      />

      <LoadingOverlay
        open={isRestoring}
        title='Restauration en cours…'
        description='Veuillez patienter, ne fermez pas cette page.'
      />
    </div>
  );
};

export default GestionDonneesSection;
