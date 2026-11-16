import { LigneSortieInterface, UtilisateurRef } from "./BonSortie";
import {
  LivraisonInterface,
  LivraisonSortieRef,
  LivraisonStatutType,
  StatutConformiteReceptionType,
  StatutReceptionType,
} from "./Livraison";

export interface ReceptionUtilisateurRef {
  _id: string;
  nom?: string;
  prenom?: string;
}

export interface ReceptionLivraisonRef {
  _id: string;
  numeroLivraison: string;
  dateCreationLivraison: string;
  dateLivraison: string | null;
  statutLivraison: LivraisonStatutType;
  statutReception?: StatutReceptionType;
  dateRegularisation?: string | null;
  sortie: LivraisonSortieRef | null;
}

export interface ReceptionInterface {
  _id: string;
  numeroReception: string;
  dateReception: string;
  estConforme: boolean;
  statutConformite: StatutConformiteReceptionType;
  commentaireReception: string;
  dateRegularisation?: string | null;
  motifRegularisation?: string | null;
  commentaireRegularisation?: string | null;
  utilisateurRegularisation?: UtilisateurRef | null;
  utilisateur: ReceptionUtilisateurRef | null;
  livraison: ReceptionLivraisonRef | null;
  lignes: LigneSortieInterface[];
}

export interface RegulariserLigneInterface {
  ligneId: string;
  quantiteRegularisee?: number;
}

export interface ManageRegularisationInterface {
  regulariserReception?: boolean;
  lignes?: RegulariserLigneInterface[];
  motif: string;
  commentaire?: string;
}

export interface AnomaliesLivraisonInterface {
  livraison: LivraisonInterface;
  reception: ReceptionInterface | null;
  anomalies: {
    receptionNonConforme: boolean;
    lignesNonRecues: LigneSortieInterface[];
  };
}

export interface AnomaliesSortieInterface {
  anomalies: AnomaliesLivraisonInterface[];
  recevables: LivraisonInterface[];
}

export interface RegularisationFormLigneInterface {
  ligneId: string;
  selectionne: boolean;
  quantiteRegularisee?: number | "";
}

export interface RegularisationFormInterface {
  regulariserReception: boolean;
  lignes: RegularisationFormLigneInterface[];
  motif: string;
  commentaire?: string;
}

export interface ManageReceptionInterface {
  livraisonId: string;
  lignesRecues: string[];
  estConforme: boolean;
  commentaireReception?: string;
  commentaireLivraison?: string;
  dateReception?: string;
}
