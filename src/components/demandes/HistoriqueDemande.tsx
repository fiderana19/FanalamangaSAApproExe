import React from "react";
import { useGetTraitementsDemande } from "@/hooks/useGetTraitementsDemande";
import { TraitementDemandeInterface } from "@/interfaces/Demande";
import HistoriqueFlow from "@/components/history/HistoriqueFlow";
import { construireItemsDemande } from "@/components/demandes/historiqueDemandeItems";

interface HistoriqueDemandeProps {
  demandeId?: string;
}

const HistoriqueDemande: React.FC<HistoriqueDemandeProps> = ({ demandeId }) => {
  const { data: traitements, isLoading, isError } =
    useGetTraitementsDemande(demandeId);

  const items = construireItemsDemande(
    (traitements ?? []) as TraitementDemandeInterface[],
  );

  return (
    <HistoriqueFlow
      titre="Historique du traitement"
      items={items}
      isLoading={isLoading}
      isError={isError}
      vide="Aucun traitement enregistré"
      hauteurAdaptative
    />
  );
};

export default HistoriqueDemande;
