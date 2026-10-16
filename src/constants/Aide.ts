import { AIDE_ADMIN } from "@/constants/aide/AideAdmin";
import { AIDE_AGENT_APPRO } from "@/constants/aide/AideAgentAppro";
import { AIDE_CHEF_SERVICE } from "@/constants/aide/AideChefService";
import { AIDE_CONTROLEUR_GESTION } from "@/constants/aide/AideControleurGestion";
import { AIDE_EMPLOYE } from "@/constants/aide/AideEmploye";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_CONTENU: Record<string, AideSection[]> = {
    employe: AIDE_EMPLOYE,
    chef_service: AIDE_CHEF_SERVICE,
    controleur_gestion: AIDE_CONTROLEUR_GESTION,
    agent_appro: AIDE_AGENT_APPRO,
    admin: AIDE_ADMIN,
};

export const AIDE_RESUME: Record<string, string> = {
    employe:
        "Retrouvez ici l'explication et les tutoriels de toutes les actions de votre espace : demandes, bons de magasin, approvisionnements, livraisons et compte.",
    chef_service:
        "Retrouvez ici l'explication et les tutoriels de toutes les actions de votre espace : validation des demandes du service, bons de magasin, approvisionnements, livraisons et compte.",
    controleur_gestion:
        "Retrouvez ici l'explication et les tutoriels de toutes les actions de votre espace : contrôle des demandes, consultation des contrôles, historique et compte.",
    agent_appro:
        "Retrouvez ici l'explication et les tutoriels de toutes les actions de votre espace : ressources, approvisionnements, achats, bons de sortie, livraisons et compte.",
    admin:
        "Retrouvez ici l'explication et les tutoriels de toutes les actions de votre espace : services, responsabilités, comptes et compte.",
};

export const getAideContenu = (role?: string): AideSection[] =>
    role ? AIDE_CONTENU[role] ?? [] : [];

export const getAideResume = (role?: string): string =>
    role ? AIDE_RESUME[role] ?? "" : "";
