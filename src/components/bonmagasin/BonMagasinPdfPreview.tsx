import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BonMagasinPdfPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
  fileName: string;
  onDownload: () => void;
  title?: string;
}

const BonMagasinPdfPreview: React.FC<BonMagasinPdfPreviewProps> = ({
  open,
  onOpenChange,
  url,
  fileName,
  onDownload,
  title = "Aperçu du bon de magasin",
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="h-[70vh] overflow-hidden rounded-md border border-brand-border bg-gray-50">
        {url ? (
          <iframe
            src={url}
            title={`Aperçu ${fileName}`}
            className="h-full w-full"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <LoadingOutlined className="text-2xl text-brand" />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Fermer
        </Button>
        <Button
          type="button"
          variant="brand"
          onClick={onDownload}
          disabled={!url}
        >
          <FileDown /> Télécharger le PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default BonMagasinPdfPreview;