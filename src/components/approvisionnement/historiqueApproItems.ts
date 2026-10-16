import {
  getApprovisionnementStatutLabel,
  getApprovisionnementStatutMeta,
} from "@/constants/ApprovisionnementStatut";
import { getRoleLabel } from "@/constants/Role";
import { TraitementApproInterface } from "@/interfaces/Approvisionnement";
import {
  ACHAT_LANE,
  formatDateHistorique,
  type HistoriqueBrancheType,
  type HistoriqueItemInterface,
} from "@/components/history/historiqueTypes";

const normaliser = (valeur: string) =>
  valeur
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/’/g, "'")
    .toLowerCase();

const BS_PATTERN = /\bBS-\d+-\d+\b/;
const LV_PATTERN = /\bLV-\d+-\d+\b/;

const estAchat = (commentaire: string) => {
  const texte = normaliser(commentaire);
  return texte.includes("demande d'achat") || texte.includes("achat recu");
};

const resoudreLanes = (
  traitements: TraitementApproInterface[],
): Map<string, string> => {
  const lvVersBs = new Map<string, string>();
  const lanes = new Map<string, string>();

  traitements.forEach((traitement) => {
    const commentaire = traitement.commentaireTraitementAppro ?? "";
    const bs = commentaire.match(BS_PATTERN);
    const lv = commentaire.match(LV_PATTERN);

    if (bs) {
      lanes.set(traitement._id, bs[0]);
      if (lv) {
        lvVersBs.set(lv[0], bs[0]);
      }
      return;
    }
    if (lv && lvVersBs.has(lv[0])) {
      lanes.set(traitement._id, lvVersBs.get(lv[0]) as string);
      return;
    }
    if (estAchat(commentaire)) {
      lanes.set(traitement._id, ACHAT_LANE);
    }
  });

  return lanes;
};

const getBranche = (
  statut?: string,
  commentaire?: string | null,
): HistoriqueBrancheType => {
  const texte = normaliser(commentaire ?? "");

  if (texte.includes("demande d'achat") || texte.includes("achat recu")) {
    return "achat";
  }
  if (texte.startsWith("bon de sortie")) {
    return "bsm";
  }
  if (texte.startsWith("livraison ") || texte.startsWith("reception ")) {
    return "bsm";
  }
  if (texte.startsWith("bon de magasin")) {
    return "commun";
  }
  if (statut === "en_cours" || statut === "en_cours_partiel") {
    return "commun";
  }
  if (statut === "en_cours_achat" || statut === "achat_recu") {
    return "achat";
  }
  return statut ? "bsm" : "commun";
};

const getStatutBranche = (
  statut: string | undefined,
  branche: HistoriqueBrancheType,
): string | undefined => {
  if (!statut) {
    return statut;
  }
  if (branche === "achat") {
    if (statut.endsWith("achat_recu")) {
      return "achat_recu";
    }
    if (statut.endsWith("en_cours_achat")) {
      return "en_cours_achat";
    }
    return statut;
  }
  if (branche === "bsm") {
    const base = statut
      .replace(/_en_cours_achat$/, "")
      .replace(/_achat_recu$/, "");
    return base === "en_cours_partiel" ? "pret_a_livrer" : base;
  }
  return statut;
};

const getTitre = (statut?: string, commentaire?: string | null) => {
  if (commentaire?.startsWith("Bon de magasin")) {
    return "BM établi";
  }
  if (statut === "en_cours") {
    return commentaire || getApprovisionnementStatutLabel(statut);
  }
  return getApprovisionnementStatutLabel(statut);
};

export const construireItemsAppro = (
  traitements: TraitementApproInterface[],
): HistoriqueItemInterface[] => {
  const lanes = resoudreLanes(traitements);

  return traitements.map((traitement) => {
    const branche = getBranche(
      traitement.statutTraitementAppro,
      traitement.commentaireTraitementAppro,
    );
    const statutAffiche = getStatutBranche(
      traitement.statutTraitementAppro,
      branche,
    );
    const titre = getTitre(
      statutAffiche,
      traitement.commentaireTraitementAppro,
    );

    return {
      id: traitement._id,
      titre,
      sousTitre: traitement.utilisateur?.role
        ? getRoleLabel(traitement.utilisateur.role)
        : "Utilisateur inconnu",
      date: formatDateHistorique(traitement.dateTraitementAppro),
      commentaire:
        traitement.commentaireTraitementAppro &&
        traitement.commentaireTraitementAppro !== titre
          ? traitement.commentaireTraitementAppro
          : null,
      meta: getApprovisionnementStatutMeta(statutAffiche),
      branche,
      lane: lanes.get(traitement._id),
    };
  });
};
