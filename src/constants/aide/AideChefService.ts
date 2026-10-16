import {
    ClipboardList,
    ShoppingCart,
    Truck,
    User,
    Warehouse,
    Workflow,
} from "lucide-react";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_CHEF_SERVICE: AideSection[] = [
    {
        id: "circuit",
        titre: "Votre rôle dans le circuit",
        icone: Workflow,
        intro: "En tant que chef de service, vous êtes le premier niveau de validation des demandes déposées par les employés de votre service.",
        actions: [
            {
                titre: "Les grandes étapes",
                description: "Vous validez ou refusez les demandes, puis suivez leur traitement jusqu'à la réception.",
                etapes: [
                    "Vos employés créent des demandes (statut « En attente »).",
                    "Vous validez ou refusez chaque demande de votre service.",
                    "Les demandes validées passent au contrôle du contrôleur de gestion, puis à l'approvisionnement.",
                    "Vous pouvez suivre les bons de magasin, approvisionnements et livraisons issus de vos demandes.",
                ],
                astuce: "Vous ne voyez que les demandes relevant de votre service.",
            },
        ],
    },
    {
        id: "demandes",
        titre: "Demandes de mon service",
        icone: ClipboardList,
        intro: "Consultez, suivez et traitez les demandes déposées par les employés de votre service.",
        actions: [
            {
                titre: "Consulter les demandes du service",
                description: "Retrouvez l'ensemble des demandes de votre service et leur statut.",
                etapes: [
                    "Ouvrez [Demande](/chef_service/demande) dans le menu.",
                    "Utilisez la recherche (numéro ou motif) et le filtre par statut.",
                    "Cliquez sur une ligne pour ouvrir le détail de la demande.",
                ],
                astuce: "Les demandes urgentes sont mises en évidence pour être traitées en priorité.",
            },
            {
                titre: "Valider une demande",
                description: "Approuvez une demande conforme au besoin de votre service.",
                etapes: [
                    "Depuis le détail d'une demande « En attente », cliquez sur l'action de validation.",
                    "Vérifiez le motif et les lignes demandées.",
                    "Validez la demande : son statut passe à « Validée » et elle est transmise au contrôle.",
                ],
            },
            {
                titre: "Refuser une demande",
                description: "Rejetez une demande non justifiée ou non conforme.",
                etapes: [
                    "Depuis le détail d'une demande « En attente », cliquez sur l'action de validation.",
                    "Choisissez le refus et indiquez le motif du refus.",
                    "Confirmez : le statut passe à « Refusée interne » et l'employé est notifié.",
                ],
                astuce: "Indiquez toujours un motif clair pour faciliter la correction par l'employé.",
            },
        ],
    },
    {
        id: "bon-magasin",
        titre: "Bons de magasin",
        icone: Warehouse,
        intro: "Suivez les bons de magasin établis à partir des demandes validées de votre service.",
        actions: [
            {
                titre: "Consulter les bons de magasin",
                description: "Prenez connaissance des sorties établies pour votre service.",
                etapes: [
                    "Ouvrez [Bon de magasin](/chef_service/bon-magasin) dans le menu.",
                    "Recherchez ou filtrez la liste, puis cliquez sur un bon pour voir son détail.",
                ],
            },
        ],
    },
    {
        id: "approvisionnement",
        titre: "Approvisionnements",
        icone: ShoppingCart,
        intro: "Suivez l'avancement global du traitement des demandes de votre service.",
        actions: [
            {
                titre: "Consulter un approvisionnement",
                description: "Visualisez les bons de magasin, achats et livraisons liés à une demande.",
                etapes: [
                    "Ouvrez [Approvisionnement](/chef_service/approvisionnement) dans le menu.",
                    "Cliquez sur une ligne pour ouvrir le détail.",
                    "Consultez les branches et l'avancement du traitement.",
                ],
                astuce: "Le statut « En cours (partiel) » signale un traitement partiel (achat ou réception en cours).",
            },
        ],
    },
    {
        id: "livraison",
        titre: "Livraisons",
        icone: Truck,
        intro: "Suivez les livraisons associées aux approvisionnements de votre service.",
        actions: [
            {
                titre: "Consulter les livraisons",
                description: "Prenez connaissance des articles livrés ou en cours de livraison.",
                etapes: [
                    "Ouvrez [Livraison](/chef_service/livraison) dans le menu.",
                    "Cliquez sur une livraison pour consulter son détail.",
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
                    "Ouvrez [Profil](/chef_service/profil) dans le menu.",
                    "Consultez vos informations (nom, prénom, service, responsabilité).",
                ],
            },
            {
                titre: "Changer mon mot de passe",
                description: "Mettez à jour votre mot de passe de connexion.",
                etapes: [
                    "Depuis [Profil](/chef_service/profil), ouvrez [Changer le mot de passe](/chef_service/profil/mot-de-passe).",
                    "Saisissez votre ancien mot de passe puis le nouveau.",
                    "Confirmez pour enregistrer le changement.",
                ],
                astuce: "Choisissez un mot de passe suffisamment long et difficile à deviner.",
            },
        ],
    },
];
