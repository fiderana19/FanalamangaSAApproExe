import { pdf } from "@react-pdf/renderer";
import ReceptionPdf from "@/components/reception/ReceptionPdf";
import { LivraisonInterface } from "@/interfaces/Livraison";

export const generateReceptionBlob = async (livraison: LivraisonInterface) => {
  const instance = pdf(<ReceptionPdf livraison={livraison} />);
  return instance.toBlob();
};
