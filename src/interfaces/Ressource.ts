export interface RessourceInterface {
    _id: string;
    reference: string;
    designationRessource: string;
    ressourceDescription: string;
    unite: string;
    categorie: string;
}

export interface ManageRessourceInterface {
    reference: string;
    designationRessource: string;
    ressourceDescription: string;
    unite: string;
    categorie: string;
}

export interface RessourceIgnoree {
    reference: string;
    raison: string;
}

export interface RessourceInvalide {
    ligne: number;
    reference?: string;
    erreurs: string[];
}

export interface RessourceImportResult {
    total: number;
    creees: RessourceInterface[];
    ignorees: RessourceIgnoree[];
    invalides: RessourceInvalide[];
}