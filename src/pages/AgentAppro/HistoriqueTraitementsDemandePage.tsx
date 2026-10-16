import React from "react";
import HistoriqueTable, {
  HistoriqueColumn,
} from "@/components/historique/HistoriqueTable";
import { useGetHistoriqueTraitementsDemande } from "@/hooks/useGetHistoriqueTraitementsDemande";
import { TRAITEMENT_STATUTS, getTraitementStatutLabel } from "@/constants/DemandeStatut";
import { formatDate } from "@/utils/Date";
import { TraitementDemandeHistoriqueInterface } from "@/interfaces/Demande";

const NOM_PRENOM = (nom?: string, prenom?: string): string =>
  `${nom ?? ""} ${prenom ?? ""}`.trim() || "—";

const USER = (item: TraitementDemandeHistoriqueInterface): string =>
  item.utilisateur ? NOM_PRENOM(item.utilisateur.nom, item.utilisateur.prenom) : "—";

const HistoriqueTraitementsDemandePage: React.FC = () => {
  const { data, isLoading, isError } = useGetHistoriqueTraitementsDemande();

  const traitements = (data ?? []) as TraitementDemandeHistoriqueInterface[];

  const statutOptions = TRAITEMENT_STATUTS.map((value) => ({
    value,
    label: getTraitementStatutLabel(value),
  }));

  const columns: HistoriqueColumn<TraitementDemandeHistoriqueInterface>[] = [
    {
      key: "date",
      label: "Date du traitement",
      render: (item) => formatDate(item.dateTraitementDemande),
    },
    {
      key: "numeroDemande",
      label: "N° demande",
      render: (item) => item.demande?.numeroDemande ?? "—",
    },
    {
      key: "demandeur",
      label: "Demandeur",
      render: (item) =>
        item.demande?.demandeur
          ? NOM_PRENOM(item.demande.demandeur.nom ?? "", item.demande.demandeur.prenom ?? "")
          : "—",
    },
    {
      key: "statut",
      label: "Traitement",
      render: (item) => getTraitementStatutLabel(item.statutTraitementDemande),
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
      render: (item) => item.commentaireTraitementDemande ?? "—",
    },
  ];

  return (
    <HistoriqueTable
      columns={columns}
      data={traitements}
      isLoading={isLoading}
      isError={isError}
      emptyLabel='Aucun traitement de demande enregistré'
      errorLabel='Une erreur est survenue lors du chargement des traitements.'
      searchPlaceholder='Recherche par mot-clé…'
      exportBaseName='historique-demandes'
      getDate={(item) => item.dateTraitementDemande}
      getStatut={(item) => item.statutTraitementDemande}
      statutOptions={statutOptions}
    />
  );
};

export default HistoriqueTraitementsDemandePage;