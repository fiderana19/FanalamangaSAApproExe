import { pdf } from "@react-pdf/renderer";
import DemandeAchatPdf from "@/components/demandeachat/DemandeAchatPdf";
import { DemandeAchatInterface } from "@/interfaces/DemandeAchat";

export { downloadBlob } from "@/utils/BonMagasinPdf";

export const generateDemandeAchatBlob = async (
  demandeAchat: DemandeAchatInterface,
) => {
  const instance = pdf(<DemandeAchatPdf demandeAchat={demandeAchat} />);
  return instance.toBlob();
};
