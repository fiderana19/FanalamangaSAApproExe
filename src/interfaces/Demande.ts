export type DemandeStatutType =
  | "en_attente"
  | "validee"
  | "refusee"
  | "controlee"
  | "refusee_controle"
  | "en_bon_magasin";

export type LigneDemandeStatutType =
  | "en_attente"
  | "validee"
  | "refusee_interne"
  | "controlee"
  | "non_conforme"
  | "en_bon_magasin";

export interface DemandeurRef {
  _id: string;
  nom?: string;
  prenom?: string;
  service?: {
    sigleService?: string;
    nomService?: string;
    lieuService?: string;
    direction?: string;
  } | null;
}

export interface RessourceRef {
  _id: string;
  reference: string;
  designationRessource: string;
  categorie: string;
  unite?: string;
}

export interface LigneDemandeInterface {
  _id: string;
  quantite: number;
  statutLigneDemande: LigneDemandeStatutType;
  demande: string;
  ressource: RessourceRef | string | null;
}

export interface DemandeInterface {
  _id: string;
  numeroDemande: string;
  motif: string;
  dateDemande: string;
  urgence: boolean;
  statutActuelDemande: DemandeStatutType;
  dateDernierTraitement: string | null;
  demandeur: DemandeurRef | null;
  lignes?: LigneDemandeInterface[];
}

export interface ManageDemandeInterface {
  motif: string;
  urgence: boolean;
}

export type TraitementDemandeStatutType =
  | "cree"
  | "valide"
  | "refuse"
  | "controle_conforme"
  | "controle_non_conforme"
  | "bon_magasin_etabli";

export type ControleStatutType = "conforme" | "non_conforme";

export interface TraitementUtilisateurRef {
  _id: string;
  nom?: string;
  prenom?: string;
  role?: string;
}

export interface TraitementDemandeInterface {
  _id: string;
  statutTraitementDemande: TraitementDemandeStatutType;
  commentaireTraitementDemande: string | null;
  dateTraitementDemande: string;
  demande: string | null;
  utilisateur: TraitementUtilisateurRef | null;
}

export interface TraitementDemandeHistoriqueInterface {
  _id: string;
  statutTraitementDemande: TraitementDemandeStatutType;
  commentaireTraitementDemande: string | null;
  dateTraitementDemande: string;
  demande: {
    _id: string;
    numeroDemande: string | null;
    motif: string | null;
    urgence: boolean;
    demandeur: { nom: string | null; prenom: string | null } | null;
  } | null;
  utilisateur: TraitementUtilisateurRef | null;
}

export interface TraiterDemandeInterface {
  commentaireTraitementDemande?: string;
  lignesValidees?: string[];
}

export interface ControlerDemandeInterface {
  lignesConformes?: string[];
  commentaireControle?: string;
}

export interface ControleInterface {
  _id: string;
  statutControle: ControleStatutType;
  commentaireControle: string | null;
  dateControle: string;
  demande: {
    _id: string;
    numeroDemande: string;
    motif: string;
    dateDemande?: string;
    urgence?: boolean;
    demandeur: DemandeurRef | null;
  } | null;
  utilisateur: TraitementUtilisateurRef | null;
}

export interface ControleDetailInterface extends ControleInterface {
  lignes: LigneDemandeInterface[];
}

export interface ManageLigneDemandeInterface {
  ressource: string;
  quantite: number;
}