import {
  getTraitementStatutLabel,
  getTraitementStatutMeta,
} from "@/constants/DemandeStatut";
import { getRoleLabel } from "@/constants/Role";
import { TraitementDemandeInterface } from "@/interfaces/Demande";
import {
  formatDateHistorique,
  type HistoriqueItemInterface,
} from "@/components/history/historiqueTypes";

export const construireItemsDemande = (
  traitements: TraitementDemandeInterface[],
): HistoriqueItemInterface[] =>
  traitements.map((traitement) => ({
    id: traitement._id,
    titre: getTraitementStatutLabel(traitement.statutTraitementDemande),
    sousTitre: traitement.utilisateur?.role
      ? getRoleLabel(traitement.utilisateur.role)
      : "Utilisateur inconnu",
    date: formatDateHistorique(traitement.dateTraitementDemande),
    commentaire: traitement.commentaireTraitementDemande,
    meta: getTraitementStatutMeta(traitement.statutTraitementDemande),
  }));
