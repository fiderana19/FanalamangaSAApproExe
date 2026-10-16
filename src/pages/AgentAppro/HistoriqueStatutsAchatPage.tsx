import React from "react";
import HistoriqueTable, {
  HistoriqueColumn,
} from "@/components/historique/HistoriqueTable";
import { useGetHistoriqueStatutsDemandeAchat } from "@/hooks/useGetHistoriqueStatutsDemandeAchat";
import {
  DEMANDE_ACHAT_STATUTS,
  getDemandeAchatStatutLabel,
} from "@/constants/DemandeAchatStatut";
import { formatDate } from "@/utils/Date";
import { StatutAchatInterface } from "@/interfaces/DemandeAchat";

const HistoriqueStatutsAchatPage: React.FC = () => {
  const { data, isLoading, isError } = useGetHistoriqueStatutsDemandeAchat();

  const statuts = (data ?? []) as StatutAchatInterface[];

  const statutOptions = DEMANDE_ACHAT_STATUTS.map((value) => ({
    value,
    label: getDemandeAchatStatutLabel(value),
  }));

  const columns: HistoriqueColumn<StatutAchatInterface>[] = [
    {
      key: "date",
      label: "Date du changement",
      render: (item) => formatDate(item.dateChangementAchat),
    },
    {
      key: "numeroDemandeAchat",
      label: "N° demande d'achat",
      render: (item) =>
        typeof item.demandeAchat === "object"
          ? (item.demandeAchat?.numeroDemandeAchat ?? "—")
          : "—",
    },
    {
      key: "statut",
      label: "Statut",
      render: (item) => getDemandeAchatStatutLabel(item.statutAchat),
    },
  ];

  return (
    <HistoriqueTable
      columns={columns}
      data={statuts}
      isLoading={isLoading}
      isError={isError}
      emptyLabel='Aucun traitement d’achat enregistré'
      errorLabel='Une erreur est survenue lors du chargement des traitements.'
      searchPlaceholder='Recherche par mot-clé…'
      exportBaseName='historique-achats'
      getDate={(item) => item.dateChangementAchat}
      getStatut={(item) => item.statutAchat}
      statutOptions={statutOptions}
    />
  );
};

export default HistoriqueStatutsAchatPage;