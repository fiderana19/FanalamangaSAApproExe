import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { getTraitementStatutLabel } from "@/constants/DemandeStatut";
import { getRoleLabel } from "@/constants/Role";
import { useGetTraitementsDemande } from "@/hooks/useGetTraitementsDemande";
import { TraitementDemandeInterface } from "@/interfaces/Demande";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const STATUTS_ACTIONS: Record<string, string> = {
  valide: "Validé",
  refuse: "Refusé",
  controle_conforme: "Conforme",
  controle_non_conforme: "Non conforme",
};

interface EntreeProps {
  traitement: TraitementDemandeInterface;
}

const Entree: React.FC<EntreeProps> = ({ traitement }) => {
  const action =
    STATUTS_ACTIONS[traitement.statutTraitementDemande] ??
    getTraitementStatutLabel(traitement.statutTraitementDemande);
  const roleLabel = traitement.utilisateur?.role
    ? getRoleLabel(traitement.utilisateur.role)
    : "";
  const role = roleLabel
    ? `${roleLabel.charAt(0).toLowerCase()}${roleLabel.slice(1)}`
    : "utilisateur inconnu";
  const nomComplet = `${traitement.utilisateur?.nom ?? ""} ${traitement.utilisateur?.prenom ?? ""}`.trim();

  return (
    <div>
      <p className="text-sm font-medium text-foreground">
        {action} par {role}
        {nomComplet ? ` ${nomComplet}` : ""}
      </p>
      <span className="mt-0.5 block text-xs text-muted-foreground">
        {formatDate(traitement.dateTraitementDemande)}
      </span>
      {traitement.commentaireTraitementDemande && (
        <p className="mt-1 text-sm text-gray-700">
          {traitement.commentaireTraitementDemande}
        </p>
      )}
    </div>
  );
};

interface DemandeTraitementsDetailsProps {
  demandeId: string;
}

const DemandeTraitementsDetails: React.FC<DemandeTraitementsDetailsProps> = ({
  demandeId,
}) => {
  const { data: traitements, isLoading } = useGetTraitementsDemande(demandeId);

  if (isLoading) {
    return (
      <div className="panel p-4 flex justify-center">
        <LoadingOutlined className="text-xl text-brand" />
      </div>
    );
  }

  const toutesTraitements = (traitements ?? []) as TraitementDemandeInterface[];
  const validations = toutesTraitements.filter(
    (t) =>
      t.statutTraitementDemande === "valide" ||
      t.statutTraitementDemande === "refuse",
  );
  const controles = toutesTraitements.filter(
    (t) =>
      t.statutTraitementDemande === "controle_conforme" ||
      t.statutTraitementDemande === "controle_non_conforme",
  );

  if (validations.length === 0 && controles.length === 0) {
    return null;
  }

  return (
    <div className="panel p-4 space-y-3">
      {validations.map((traitement) => (
        <Entree key={traitement._id} traitement={traitement} />
      ))}
      {validations.length > 0 && controles.length > 0 && (
        <div className="border-t border-brand-border" />
      )}
      {controles.map((traitement) => (
        <Entree key={traitement._id} traitement={traitement} />
      ))}
    </div>
  );
};

export default DemandeTraitementsDetails;