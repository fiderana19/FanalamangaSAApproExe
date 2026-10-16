import { LigneDemandeInterface } from "./Demande";

export type BonMagasinStatutType = "etabli" | "transmis" | "annule";

export type LigneBonMagasinStatutType =
  | "etabli"
  | "transmis"
  | "en_bon_sortie"
  | "en_cours_achat"
  | "achat_recu";

export interface BonMagasinDemandeRef {
  _id: string;
  numeroDemande: string;
  motif?: string;
  urgence?: boolean;
  demandeur?: {
    _id: string;
    nom?: string;
    prenom?: string;
    service?: {
      sigleService?: string;
      nomService?: string;
      direction?: string;
      lieuService?: string;
    } | null;
  } | null;
}

export interface LigneBonMagasinInterface {
  _id: string;
  quantiteLigneBonMagasin: number;
  observation: string;
  statutLigneBonMagasin: LigneBonMagasinStatutType;
  ligneDemande: LigneDemandeInterface | null;
}

export interface BonMagasinInterface {
  _id: string;
  numeroBonMagasin: string;
  objet: string;
  dateBonMagasin: string;
  statutBonMagasin: BonMagasinStatutType;
  dateTraitementBonMagasin: string | null;
  demande: BonMagasinDemandeRef | null;
  lignes: LigneBonMagasinInterface[];
}

export interface LigneObservationInterface {
  ligneDemandeId: string;
  observation?: string;
}

export interface ManageBonMagasinInterface {
  demandeId: string;
  objet?: string;
  dateBonMagasin?: string;
  lignesObservations?: LigneObservationInterface[];
}