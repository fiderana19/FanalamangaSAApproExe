import { ApprovisionnementInterface } from "./Approvisionnement";
import {
  ApurementType,
  LigneSortieInterface,
  SortieStatutType,
} from "./BonSortie";

export type LivraisonStatutType = "en_cours" | "livree";

export interface LivraisonReceptionRef {
  _id: string;
  numeroReception: string;
  dateReception: string;
  estConforme: boolean;
  commentaireReception: string;
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
  commentaireLivraison: string;
  utilisateur: LivraisonUtilisateurRef | null;
  reception: LivraisonReceptionRef | null;
  sortie: LivraisonSortieRef | null;
  lignes: LigneSortieInterface[];
}
