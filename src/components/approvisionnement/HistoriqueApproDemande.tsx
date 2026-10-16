import React from "react";
import { useGetTraitementsDemande } from "@/hooks/useGetTraitementsDemande";
import { useGetTraitementsAppro } from "@/hooks/useGetTraitementsAppro";
import HistoriqueFlow from "@/components/history/HistoriqueFlow";
import { construireItemsDemande } from "@/components/demandes/historiqueDemandeItems";
import { construireItemsAppro } from "@/components/approvisionnement/historiqueApproItems";
import { TraitementDemandeInterface } from "@/interfaces/Demande";
import { TraitementApproInterface } from "@/interfaces/Approvisionnement";

interface HistoriqueApproDemandeProps {
  demandeId?: string;
  approvisionnementId?: string;
}

const HistoriqueApproDemande: React.FC<HistoriqueApproDemandeProps> = ({
  demandeId,
  approvisionnementId,
}) => {
  const {
    data: traitementsDemande,
    isLoading: chargementDemande,
    isError: erreurDemande,
  } = useGetTraitementsDemande(demandeId);
  const {
    data: traitementsAppro,
    isLoading: chargementAppro,
    isError: erreurAppro,
  } = useGetTraitementsAppro(approvisionnementId);

  const items = [
    ...construireItemsDemande(
      (traitementsDemande ?? []) as TraitementDemandeInterface[],
    ),
    ...construireItemsAppro(
      (traitementsAppro ?? []) as TraitementApproInterface[],
    ),
  ];

  return (
    <HistoriqueFlow
      items={items}
      isLoading={chargementDemande || chargementAppro}
      isError={erreurDemande || erreurAppro}
      agrandissable
      branches
      espacement={180}
    />
  );
};

export default HistoriqueApproDemande;
