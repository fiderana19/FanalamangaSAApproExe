import { pdf } from "@react-pdf/renderer";
import ReceptionPdf from "@/components/reception/ReceptionPdf";
import { LivraisonInterface } from "@/interfaces/Livraison";

let pdfInstance: ReturnType<typeof pdf> | null = null;

const getPdfInstance = () => {
  if (!pdfInstance) {
    pdfInstance = pdf();
  }
  return pdfInstance;
};

export const generateReceptionBlob = async (livraison: LivraisonInterface) => {
  const instance = getPdfInstance();
  await new Promise<void>((resolve) => {
    instance.updateContainer(<ReceptionPdf livraison={livraison} />, () => resolve());
  });
  return instance.toBlob();
};
