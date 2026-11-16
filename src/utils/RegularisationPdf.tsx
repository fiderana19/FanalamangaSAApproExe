import { pdf } from "@react-pdf/renderer";
import RegularisationPdf from "@/components/reception/RegularisationPdf";
import { LivraisonInterface } from "@/interfaces/Livraison";

export const generateRegularisationBlob = async (
  livraison: LivraisonInterface,
) => {
  const instance = pdf(<RegularisationPdf livraison={livraison} />);
  return instance.toBlob();
};
