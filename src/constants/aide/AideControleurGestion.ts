import {
    ClipboardCheck,
    ClipboardList,
    History,
    User,
    Workflow,
} from "lucide-react";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_CONTROLEUR_GESTION: AideSection[] = [
    {
        id: "circuit",
        titre: "Votre rôle dans le circuit",
        icone: Workflow,
        intro: "Contrôleur de gestion, vous vous prononcez sur la conformité des demandes validées avant leur passage à l'approvisionnement.",
        actions: [
            {
                titre: "Les grandes étapes",
                description: "Vous contrôlez les lignes validées d'une demande : conformes ou non conformes.",
                etapes: [
                    "Les demandes validées par les chefs de service vous parviennent pour contrôle.",
                    "Vous sélectionnez les lignes conformes et ajoutez un commentaire si nécessaire.",
                    "Les lignes non retenues sont non conformes ; la demande devient « Contrôlée » ou « Refusée au contrôle ».",
                    "Les demandes contrôlées poursuivent leur traitement en approvisionnement.",
                ],
                astuce: "Vous pouvez retrouver l'ensemble de vos contrôles dans [Historique](/controleur_gestion/historique).",
            },
        ],
    },
    {
        id: "demandes",
        titre: "Demandes à contrôler",
        icone: ClipboardList,
        intro: "Consultez les demandes validées en attente de contrôle et ouvrez leur détail.",
        actions: [
            {
                titre: "Consulter les demandes",
                description: "Retrouvez les demandes concernées par le contrôle.",
                etapes: [
                    "Ouvrez [Demande](/controleur_gestion/demande) dans le menu.",
                    "Utilisez la recherche et le filtre par statut.",
                    "Cliquez sur une ligne pour ouvrir le détail de la demande.",
                ],
            },
        ],
    },
    {
        id: "controle",
        titre: "Effectuer un contrôle",
        icone: ClipboardCheck,
        intro: "Sélectionnez les lignes conformes d'une demande validée puis enregistrez votre contrôle.",
        actions: [
            {
                titre: "Contrôler une demande",
                description: "Validez la conformité ligne par ligne d'une demande validée.",
                etapes: [
                    "Depuis le détail d'une demande « Validée », cliquez sur l'action de contrôle.",
                    "Cochez les lignes conformes (utilisez « tout sélectionner » si toutes le sont).",
                    "Ajoutez un commentaire de contrôle si utile.",
                    "Confirmez : la demande passe à « Contrôlée » si toutes les lignes sont conformes, sinon à « Refusée au contrôle ».",
                ],
                astuce: "Les lignes non cochées sont considérées comme non conformes.",
            },
            {
                titre: "Consulter un contrôle",
                description: "Relisez le détail d'un contrôle déjà effectué.",
                etapes: [
                    "Depuis le détail d'une demande contrôlée, ouvrez la vue du contrôle.",
                    "Consultez les lignes conformes, les lignes non conformes et le commentaire.",
                ],
            },
        ],
    },
    {
        id: "historique",
        titre: "Historique des contrôles",
        icone: History,
        intro: "Retrouvez l'ensemble des contrôles que vous avez réalisés.",
        actions: [
            {
                titre: "Consulter l'historique",
                description: "Parcourez la liste de vos contrôles passés.",
                etapes: [
                    "Ouvrez [Historique](/controleur_gestion/historique) dans le menu.",
                    "Recherchez ou filtrez la liste.",
                    "Cliquez sur une entrée pour consulter le détail du contrôle.",
                ],
            },
        ],
    },
    {
        id: "compte",
        titre: "Mon compte",
        icone: User,
        intro: "Gérez vos informations personnelles et votre mot de passe.",
        actions: [
            {
                titre: "Consulter mon profil",
                description: "Vérifiez vos informations rattachées à votre compte.",
                etapes: [
                    "Ouvrez [Profil](/controleur_gestion/profil) dans le menu.",
                    "Consultez vos informations (nom, prénom, service, responsabilité).",
                ],
            },
            {
                titre: "Changer mon mot de passe",
                description: "Mettez à jour votre mot de passe de connexion.",
                etapes: [
                    "Depuis [Profil](/controleur_gestion/profil), ouvrez [Changer le mot de passe](/controleur_gestion/profil/mot-de-passe).",
                    "Saisissez votre ancien mot de passe puis le nouveau.",
                    "Confirmez pour enregistrer le changement.",
                ],
                astuce: "Choisissez un mot de passe suffisamment long et difficile à deviner.",
            },
        ],
    },
];
