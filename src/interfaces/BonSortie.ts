import { ApprovisionnementInterface } from "./Approvisionnement";
import { LigneBonMagasinInterface } from "./BonMagasin";

export type SortieStatutType = "en_preparation" | "sorti" | "annule";
export type ApurementType = "total" | "partiel";
export type LigneSortieStatutType =
  | "en_bon_sortie"
  | "en_livraison"
  | "livree"
  | "non_recu";

export interface LigneSortieInterface {
  _id: string;
  quantiteLigneSortie: number;
  observation: string;
  statutLigneSortie: LigneSortieStatutType;
  ligneBonMagasin: LigneBonMagasinInterface | null;
}

export interface BonSortieInterface {
  _id: string;
  numeroSortie: string;
  dateSortie: string;
  statutSortie: SortieStatutType;
  apurement: ApurementType;
  approvisionnement: ApprovisionnementInterface | null;
  lignes: LigneSortieInterface[];
}

export interface ManageBonSortieLigneInterface {
  ligneBonMagasinId: string;
  quantiteLigneSortie: number;
  observation?: string;
}

export interface ManageBonSortieInterface {
  approvisionnementId: string;
  dateSortie?: string;
  apurement?: ApurementType;
  lignes: ManageBonSortieLigneInterface[];
}