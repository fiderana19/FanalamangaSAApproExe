export interface LoginInterface {
    email: string;
    motdepasse: string;
}

export interface ForgotPasswordInterface {
    email: string;
}

export interface ChangeMyPasswordInterface {
    ancienMotDePasse: string;
    nouveauMotDePasse: string;
    confirmationMotDePasse: string;
}

export interface ProfileInterface {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    estActive?: boolean;
    role: string;
    service?: ServiceRef | string | null;
    responsabilite?: ResponsabiliteRef | string | null;
}

export interface ServiceRef {
    _id: string;
    nomService?: string;
    sigleService?: string;
    lieuService?: string;
}

export interface ResponsabiliteRef {
    _id: string;
    libelle?: string;
    descriptionResponsabilite?: string;
}

export interface UserInterface {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    estActive: boolean;
    role: string;
    service: ServiceRef | string | null;
    responsabilite: ResponsabiliteRef | string | null;
}

export interface ManageUserInterface {
    nom: string;
    prenom?: string;
    email: string;
    telephone: string;
    role: string;
    service?: string | null;
    responsabilite?: string | null;
}

export interface CreateUserInterface {
    nom: string;
    prenom?: string;
    email: string;
    telephone: string;
    motdepasse: string;
    estActive: boolean;
    role: string;
    service?: string | null;
    responsabilite?: string | null;
}