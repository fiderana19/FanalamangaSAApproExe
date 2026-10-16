import { pdf } from "@react-pdf/renderer";
import DemandeAchatPdf from "@/components/demandeachat/DemandeAchatPdf";
import { DemandeAchatInterface } from "@/interfaces/DemandeAchat";

export { downloadBlob } from "@/utils/BonMagasinPdf";

let pdfInstance: ReturnType<typeof pdf> | null = null;

const getPdfInstance = () => {
  if (!pdfInstance) {
    pdfInstance = pdf();
  }
  return pdfInstance;
};

export const generateDemandeAchatBlob = async (
  demandeAchat: DemandeAchatInterface,
) => {
  const instance = getPdfInstance();
  await new Promise<void>((resolve) => {
    instance.updateContainer(
      <DemandeAchatPdf demandeAchat={demandeAchat} />,
      () => resolve(),
    );
  });
  return instance.toBlob();
};
