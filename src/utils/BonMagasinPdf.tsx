import { pdf } from "@react-pdf/renderer";
import BonMagasinPdf from "@/components/bonmagasin/BonMagasinPdf";
import BonSortiePdf from "@/components/bonmagasin/BonSortiePdf";
import { BonMagasinInterface } from "@/interfaces/BonMagasin";
import { BonSortieInterface } from "@/interfaces/BonSortie";
import { genererQrDataUrl } from "@/utils/QrCode";

export const generateBonMagasinBlob = async (bon: BonMagasinInterface) => {
  const instance = pdf(<BonMagasinPdf bon={bon} />);
  return instance.toBlob();
};

export const generateBonSortieBlob = async (bon: BonSortieInterface) => {
  let qrCodeDataUrl: string | undefined;
  try {
    qrCodeDataUrl = await genererQrDataUrl(bon._id);
  } catch {
    qrCodeDataUrl = undefined;
  }
  const instance = pdf(
    <BonSortiePdf bon={bon} qrCodeDataUrl={qrCodeDataUrl} />,
  );
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};