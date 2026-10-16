import { LigneSortieInterface } from "./BonSortie";
import { LivraisonSortieRef, LivraisonStatutType } from "./Livraison";

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
  sortie: LivraisonSortieRef | null;
}

export interface ReceptionInterface {
  _id: string;
  numeroReception: string;
  dateReception: string;
  estConforme: boolean;
  commentaireReception: string;
  utilisateur: ReceptionUtilisateurRef | null;
  livraison: ReceptionLivraisonRef | null;
  lignes: LigneSortieInterface[];
}

export interface ManageReceptionInterface {
  livraisonId: string;
  lignesRecues: string[];
  estConforme: boolean;
  commentaireReception?: string;
  commentaireLivraison?: string;
  dateReception?: string;
}
