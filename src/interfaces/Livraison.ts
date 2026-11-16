import { ApprovisionnementInterface } from "./Approvisionnement";
import {
  ApurementType,
  LigneSortieInterface,
  SortieStatutType,
} from "./BonSortie";

export type LivraisonStatutType = "en_cours" | "livree";
export type StatutReceptionType =
  | "en_attente"
  | "conforme"
  | "non_conforme"
  | "regularisee";
export type StatutConformiteReceptionType =
  | "conforme"
  | "non_conforme"
  | "regularisee";

export interface LivraisonReceptionRef {
  _id: string;
  numeroReception: string;
  dateReception: string;
  estConforme: boolean;
  statutConformite: StatutConformiteReceptionType;
  commentaireReception: string;
  dateRegularisation?: string | null;
  motifRegularisation?: string | null;
  commentaireRegularisation?: string | null;
  utilisateurRegularisation?: LivraisonUtilisateurRef | null;
}

export interface LivraisonSortieRef {
  _id: string;
  numeroSortie: string;
  dateSortie: string;
  statutSortie: SortieStatutType;
  apurement: ApurementType;
  approvisionnement: ApprovisionnementInterface | null;
}

export interface LivraisonUtilisateurRef {
  _id: string;
  nom?: string;
  prenom?: string;
}

export interface LivraisonInterface {
  _id: string;
  numeroLivraison: string;
  dateCreationLivraison: string;
  dateLivraison: string | null;
  statutLivraison: LivraisonStatutType;
  statutReception: StatutReceptionType;
  dateRegularisation?: string | null;
  commentaireLivraison: string;
  utilisateur: LivraisonUtilisateurRef | null;
  reception: LivraisonReceptionRef | null;
  sortie: LivraisonSortieRef | null;
  lignes: LigneSortieInterface[];
}
