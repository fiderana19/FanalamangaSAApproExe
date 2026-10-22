import React from "react";
import HistoriqueTable, {
  HistoriqueColumn,
} from "@/components/historique/HistoriqueTable";
import { useGetHistoriqueTraitementsAppro } from "@/hooks/useGetHistoriqueTraitementsAppro";
import {
  APPROVISIONNEMENT_STATUTS_AFFICHES,
  getApprovisionnementStatutDisplayLabel,
  getApprovisionnementStatutLabel,
} from "@/constants/ApprovisionnementStatut";
import { formatDate } from "@/utils/Date";
import { TraitementApproHistoriqueInterface } from "@/interfaces/Approvisionnement";

const NOM_PRENOM = (nom?: string, prenom?: string): string =>
  `${nom ?? ""} ${prenom ?? ""}`.trim() || "—";

const USER = (item: TraitementApproHistoriqueInterface): string =>
  item.utilisateur ? NOM_PRENOM(item.utilisateur.nom, item.utilisateur.prenom) : "—";

const HistoriqueTraitementsApproPage: React.FC = () => {
  const { data, isLoading, isError } = useGetHistoriqueTraitementsAppro();

  const traitements = (data ?? []) as TraitementApproHistoriqueInterface[];

  const statutOptions = APPROVISIONNEMENT_STATUTS_AFFICHES.map((value) => ({
    value,
    label: value,
  }));

  const columns: HistoriqueColumn<TraitementApproHistoriqueInterface>[] = [
    {
      key: "date",
      label: "Date du traitement",
      render: (item) => formatDate(item.dateTraitementAppro),
    },
    {
      key: "numeroAppro",
      label: "N° approvisionnement",
      render: (item) => item.approvisionnement?.numeroApprovisionnement ?? "—",
    },
    {
      key: "numeroBon",
      label: "N° bon de magasin",
      render: (item) =>
        item.approvisionnement?.bonMagasin?.numeroBonMagasin ?? "—",
    },
    {
      key: "statut",
      label: "Traitement",
      render: (item) => getApprovisionnementStatutLabel(item.statutTraitementAppro),
    },
    {
      key: "utilisateur",
      label: "Traité par",
      render: (item) => USER(item),
    },
    {
      key: "commentaire",
      label: "Commentaire",
      className: "whitespace-normal min-w-56",
      render: (item) => item.commentaireTraitementAppro ?? "—",
    },
  ];

  return (
    <HistoriqueTable
      columns={columns}
      data={traitements}
      isLoading={isLoading}
      isError={isError}
      emptyLabel='Aucun traitement d’approvisionnement enregistré'
      errorLabel='Une erreur est survenue lors du chargement des traitements.'
      searchPlaceholder='Recherche par mot-clé…'
      exportBaseName='historique-approvisionnements'
      getDate={(item) => item.dateTraitementAppro}
      getStatut={(item) =>
        getApprovisionnementStatutDisplayLabel(item.statutTraitementAppro)
      }
      statutOptions={statutOptions}
    />
  );
};

export default HistoriqueTraitementsApproPage;