import React from "react";
import { useGetStatutsDemandeAchat } from "@/hooks/useGetStatutsDemandeAchat";
import {
  getDemandeAchatStatutLabel,
  getDemandeAchatStatutMeta,
} from "@/constants/DemandeAchatStatut";
import { StatutAchatInterface } from "@/interfaces/DemandeAchat";
import HistoriqueFlow from "@/components/history/HistoriqueFlow";
import {
  formatDateHistorique,
  type HistoriqueItemInterface,
} from "@/components/history/historiqueTypes";

interface HistoriqueAchatProps {
  demandeAchatId?: string;
}

const HistoriqueAchat: React.FC<HistoriqueAchatProps> = ({
  demandeAchatId,
}) => {
  const { data: statuts, isLoading, isError } =
    useGetStatutsDemandeAchat(demandeAchatId);

  const items: HistoriqueItemInterface[] = (
    (statuts ?? []) as StatutAchatInterface[]
  ).map((statut) => ({
    id: statut._id,
    titre: getDemandeAchatStatutLabel(statut.statutAchat),
    date: formatDateHistorique(statut.dateChangementAchat),
    meta: getDemandeAchatStatutMeta(statut.statutAchat),
  }));

  return (
    <HistoriqueFlow
      items={items}
      isLoading={isLoading}
      isError={isError}
      hauteurAdaptative
    />
  );
};

export default HistoriqueAchat;
