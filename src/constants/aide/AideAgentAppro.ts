import {
    Boxes,
    PackageOpen,
    ShoppingBag,
    ShoppingCart,
    Truck,
    User,
    Warehouse,
    Workflow,
} from "lucide-react";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_AGENT_APPRO: AideSection[] = [
    {
        id: "circuit",
        titre: "Votre rôle dans le circuit",
        icone: Workflow,
        intro: "Agent d'approvisionnement, vous traitez les demandes contrôlées : vérification du stock, achats, bons de sortie, livraisons et réceptions.",
        actions: [
            {
                titre: "Les grandes étapes",
                description: "Vous transformez les demandes contrôlées en sorties de stock ou en achats, puis suivez jusqu'à la réception.",
                etapes: [
                    "Les demandes contrôlées alimentent les approvisionnements.",
                    "Vous vérifiez la disponibilité du stock pour chaque article.",
                    "Les articles disponibles génèrent un bon de sortie ; les articles manquants génèrent une demande d'achat.",
                    "Les articles achetés sont livrés puis réceptionnés.",
                ],
                astuce: "Un approvisionnement peut combiner stock et achat : son statut « En cours (partiel) » reflète cet avancement mixte.",
            },
        ],
    },
    {
        id: "ressources",
        titre: "Ressources",
        icone: Boxes,
        intro: "Tenez à jour le référentiel des ressources utilisées dans les demandes et les stocks.",
        actions: [
            {
                titre: "Consulter les ressources",
                description: "Parcourez le catalogue des ressources.",
                etapes: [
                    "Ouvrez [Ressource](/agent_appro/ressource) dans le menu.",
                    "Recherchez ou filtrez la liste.",
                    "Cliquez sur une ressource pour consulter sa fiche.",
                ],
            },
            {
                titre: "Créer une ressource",
                description: "Ajoutez une nouvelle ressource au référentiel.",
                etapes: [
                    "Depuis [Ressource](/agent_appro/ressource), cliquez sur [Nouvelle ressource](/agent_appro/ressource/create).",
                    "Renseignez la référence, la désignation, la catégorie, l'unité et les informations de stock.",
                    "Enregistrez la ressource.",
                ],
            },
            {
                titre: "Modifier une ressource",
                description: "Mettez à jour les informations d'une ressource existante.",
                etapes: [
                    "Depuis la fiche d'une ressource, cliquez sur « Modifier ».",
                    "Mettez à jour les champs souhaités.",
                    "Enregistrez les modifications.",
                ],
            },
            {
                titre: "Importer des ressources",
                description: "Chargez un lot de ressources depuis un fichier JSON.",
                etapes: [
                    "Depuis [Ressource](/agent_appro/ressource), cliquez sur [Importer](/agent_appro/ressource/import).",
                    "Sélectionnez ou déposez un fichier au format .json.",
                    "Lancez l'import et consultez le résultat (lignes importées et lignes rejetées).",
                ],
                astuce: "Seuls les fichiers .json sont acceptés ; corrigez les lignes rejetées puis relancez l'import.",
            },
        ],
    },
    {
        id: "bon-magasin",
        titre: "Bons de magasin",
        icone: Warehouse,
        intro: "Les bons de magasin décrivent les articles à sortir du stock pour une demande contrôlée.",
        actions: [
            {
                titre: "Consulter les bons de magasin",
                description: "Parcourez les bons de magasin à traiter ou déjà traités.",
                etapes: [
                    "Ouvrez [Bon de magasin](/agent_appro/bon-magasin) dans le menu.",
                    "Recherchez ou filtrez la liste, puis cliquez sur un bon pour voir son détail et ses lignes.",
                ],
            },
        ],
    },
    {
        id: "approvisionnement",
        titre: "Approvisionnements",
        icone: ShoppingCart,
        intro: "L'approvisionnement est le dossier central qui relie la demande contrôlée, le bon de magasin, les achats et les sorties.",
        actions: [
            {
                titre: "Consulter les approvisionnements",
                description: "Suivez les dossiers d'approvisionnement et leur avancement.",
                etapes: [
                    "Ouvrez [Approvisionnement](/agent_appro/approvisionnement) dans le menu.",
                    "Recherchez ou filtrez la liste, puis cliquez sur un dossier pour ouvrir son détail.",
                    "Consultez l'historique et les branches (bon de magasin, achats).",
                ],
            },
            {
                titre: "Vérifier la disponibilité du stock",
                description: "Confrontez les articles du bon de magasin au stock disponible.",
                etapes: [
                    "Depuis le détail d'un approvisionnement, ouvrez « Disponibilité des ressources ».",
                    "Lancez la vérification du stock pour les lignes à traiter.",
                    "Le verdict indique les articles disponibles et les articles manquants.",
                    "Générez les bons de sortie (articles disponibles) et les demandes d'achat (articles manquants).",
                ],
                astuce: "La vérification peut être relancée si le stock évolue.",
            },
        ],
    },
    {
        id: "demande-achat",
        titre: "Demandes d'achat",
        icone: ShoppingBag,
        intro: "Une demande d'achat regroupe les articles manquants à commander pour un approvisionnement.",
        actions: [
            {
                titre: "Créer une demande d'achat",
                description: "Générez une demande d'achat pour les articles en rupture.",
                etapes: [
                    "Depuis un approvisionnement, ouvrez l'action de création d'une demande d'achat.",
                    "Vérifiez les articles et quantités à commander.",
                    "Validez : la demande d'achat est créée et rattachée à l'approvisionnement.",
                ],
            },
            {
                titre: "Consulter les demandes d'achat",
                description: "Suivez les demandes d'achat et leur état.",
                etapes: [
                    "Ouvrez [Achat](/agent_appro/demande-achat) dans le menu.",
                    "Cliquez sur une demande d'achat pour consulter son détail.",
                ],
            },
        ],
    },
    {
        id: "bon-sortie",
        titre: "Bons de sortie de magasin",
        icone: PackageOpen,
        intro: "Le bon de sortie matérialise la sortie effective des articles disponibles du stock.",
        actions: [
            {
                titre: "Créer un bon de sortie",
                description: "Générez un bon de sortie pour les articles disponibles d'un approvisionnement.",
                etapes: [
                    "Depuis un approvisionnement, ouvrez l'action de création d'un bon de sortie.",
                    "Vérifiez les articles et quantités à sortir du stock.",
                    "Validez : le bon de sortie est créé et rattaché à l'approvisionnement.",
                ],
            },
            {
                titre: "Consulter les bons de sortie",
                description: "Parcourez les bons de sortie émis.",
                etapes: [
                    "Ouvrez [Bon de sortie de magasin](/agent_appro/bon-sortie) dans le menu.",
                    "Cliquez sur un bon pour consulter son détail.",
                ],
            },
        ],
    },
    {
        id: "livraison",
        titre: "Livraisons",
        icone: Truck,
        intro: "Suivez les livraisons, notamment pour les articles issus d'achats, jusqu'à leur réception.",
        actions: [
            {
                titre: "Consulter les livraisons",
                description: "Parcourez les livraisons en cours et passées.",
                etapes: [
                    "Ouvrez [Livraison](/agent_appro/livraison) dans le menu.",
                    "Recherchez ou filtrez la liste.",
                    "Cliquez sur une livraison pour consulter son détail et ses articles.",
                ],
                astuce: "Le statut « Achat reçu » indique que l'article commandé est arrivé et peut être traité.",
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
                    "Ouvrez [Profil](/agent_appro/profil) dans le menu.",
                    "Consultez vos informations (nom, prénom, service, responsabilité).",
                ],
            },
            {
                titre: "Changer mon mot de passe",
                description: "Mettez à jour votre mot de passe de connexion.",
                etapes: [
                    "Depuis [Profil](/agent_appro/profil), ouvrez [Changer le mot de passe](/agent_appro/profil/mot-de-passe).",
                    "Saisissez votre ancien mot de passe puis le nouveau.",
                    "Confirmez pour enregistrer le changement.",
                ],
                astuce: "Choisissez un mot de passe suffisamment long et difficile à deviner.",
            },
        ],
    },
];
