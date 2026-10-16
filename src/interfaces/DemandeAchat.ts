import { ApprovisionnementInterface } from "./Approvisionnement";
import { RessourceRef } from "./Demande";

export type DemandeAchatStatutType = "en_cours" | "termine";

export interface LigneDemandeAchatInterface {
  _id: string;
  quantite: number;
  ressource: RessourceRef | null;
}

export interface DemandeAchatInterface {
  _id: string;
  numeroDemandeAchat: string;
  dateDemandeAchat: string;
  statutActuelDemandeAchat: DemandeAchatStatutType;
  approvisionnement: ApprovisionnementInterface | null;
  lignes: LigneDemandeAchatInterface[];
}

export interface ManageDemandeAchatLigneInterface {
  ressourceId: string;
  quantite: number;
}

export interface ManageDemandeAchatInterface {
  approvisionnementId: string;
  lignes: ManageDemandeAchatLigneInterface[];
}

export interface ManageDemandeAchatFormLigneInterface {
  ressourceId: string;
  quantite: number;
  inclure: boolean;
}

export interface ManageDemandeAchatFormInterface {
  approvisionnementId: string;
  lignes: ManageDemandeAchatFormLigneInterface[];
}

export interface StatutAchatInterface {
  _id: string;
  statutAchat: DemandeAchatStatutType;
  dateChangementAchat: string;
  demandeAchat:
    | { _id: string; numeroDemandeAchat: string | null }
    | string
    | null;
}
