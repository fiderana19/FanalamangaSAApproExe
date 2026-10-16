export type ApprovisionnementStatutType =
  | "en_cours"
  | "en_cours_partiel"
  | "en_cours_achat"
  | "achat_recu"
  | "pret_a_livrer"
  | "en_livraison"
  | "partiellement_recu"
  | "recu"
  | "pret_a_livrer_en_cours_achat"
  | "pret_a_livrer_achat_recu"
  | "en_livraison_en_cours_achat"
  | "en_livraison_achat_recu"
  | "partiellement_recu_en_cours_achat"
  | "partiellement_recu_achat_recu";

export interface ApprovisionnementDemandeRef {
  _id: string;
  numeroDemande: string;
  motif?: string;
  urgence?: boolean;
  demandeur: {
    _id: string;
    nom?: string;
    prenom?: string;
    service?: {
      _id: string;
      sigleService?: string;
      nomService?: string;
      direction?: string;
      lieuService?: string;
    } | null;
  } | null;
}

export interface ApprovisionnementBonRef {
  _id: string;
  numeroBonMagasin: string;
  objet: string;
  dateBonMagasin: string;
  statutBonMagasin: string;
  demande: ApprovisionnementDemandeRef | null;
}

export interface ApprovisionnementInterface {
  _id: string;
  numeroApprovisionnement: string;
  dateApprovisionnement: string;
  statutApprovisionnement: ApprovisionnementStatutType;
  commentaireApprovisionnement: string;
  bonMagasin: ApprovisionnementBonRef | null;
  utilisateur: {
    _id: string;
    nom?: string;
    prenom?: string;
  } | null;
}

export interface ManageApprovisionnementInterface {
  bonMagasinId: string;
  commentaireApprovisionnement?: string;
}

export interface TraitementApproInterface {
  _id: string;
  statutTraitementAppro: ApprovisionnementStatutType;
  commentaireTraitementAppro: string | null;
  dateTraitementAppro: string;
  approvisionnement: string | null;
  utilisateur: {
    _id: string;
    nom?: string;
    prenom?: string;
    role?: string;
  } | null;
}

export interface TraitementApproHistoriqueInterface {
  _id: string;
  statutTraitementAppro: ApprovisionnementStatutType;
  commentaireTraitementAppro: string | null;
  dateTraitementAppro: string;
  approvisionnement: {
    _id: string;
    numeroApprovisionnement: string | null;
    bonMagasin: { _id: string; numeroBonMagasin: string | null } | null;
  } | null;
  utilisateur: {
    _id: string;
    nom?: string;
    prenom?: string;
    role?: string;
  } | null;
}
