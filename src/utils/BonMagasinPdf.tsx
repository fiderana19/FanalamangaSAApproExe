import { pdf } from "@react-pdf/renderer";
import BonMagasinPdf from "@/components/bonmagasin/BonMagasinPdf";
import BonSortiePdf from "@/components/bonmagasin/BonSortiePdf";
import { BonMagasinInterface } from "@/interfaces/BonMagasin";
import { BonSortieInterface } from "@/interfaces/BonSortie";
import { genererQrDataUrl } from "@/utils/QrCode";

let pdfInstance: ReturnType<typeof pdf> | null = null;

const getPdfInstance = () => {
  if (!pdfInstance) {
    pdfInstance = pdf();
  }
  return pdfInstance;
};

export const generateBonMagasinBlob = async (bon: BonMagasinInterface) => {
  const instance = getPdfInstance();
  await new Promise<void>((resolve) => {
    instance.updateContainer(<BonMagasinPdf bon={bon} />, () => resolve());
  });
  return instance.toBlob();
};

export const generateBonSortieBlob = async (bon: BonSortieInterface) => {
  const instance = getPdfInstance();
  let qrCodeDataUrl: string | undefined;
  try {
    qrCodeDataUrl = await genererQrDataUrl(bon._id);
  } catch {
    qrCodeDataUrl = undefined;
  }
  await new Promise<void>((resolve) => {
    instance.updateContainer(
      <BonSortiePdf bon={bon} qrCodeDataUrl={qrCodeDataUrl} />,
      () => resolve(),
    );
  });
  return instance.toBlob();
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};