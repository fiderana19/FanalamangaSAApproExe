import {
    ClipboardList,
    ShoppingCart,
    Truck,
    User,
    Warehouse,
    Workflow,
} from "lucide-react";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_EMPLOYE: AideSection[] = [
    {
        id: "circuit",
        titre: "Comprendre le circuit d'une demande",
        icone: Workflow,
        intro: "Votre demande suit un circuit de traitement jalonné. Comprendre ces étapes vous aide à savoir où en est votre besoin.",
        actions: [
            {
                titre: "Les grandes étapes",
                description: "Du dépôt de la demande jusqu'à la réception des articles, le traitement est assuré par plusieurs acteurs.",
                etapes: [
                    "Vous créez une demande depuis votre espace (statut « En attente »).",
                    "Votre chef de service la valide ou la refuse (statut « Validée » ou « Refusée interne »).",
                    "Le contrôleur de gestion contrôle la demande conforme (statut « Contrôlée ») ou non conforme (statut « Refusée au contrôle »).",
                    "L'agent d'approvisionnement prépare l'approvisionnement, génère le bon de magasin et suit achats, livraisons et réceptions (statut « En bon de magasin »).",
                ],
                astuce: "Les statuts de la demande sont visibles dans la liste et dans le détail de la demande.",
            },
        ],
    },
    {
        id: "demandes",
        titre: "Mes demandes",
        icone: ClipboardList,
        intro: "Gérez vos demandes d'approvisionnement : création, suivi, modification et suppression tant qu'elles sont en attente.",
        actions: [
            {
                titre: "Créer une demande",
                description: "Exprimez un besoin en renseignant le motif, les lignes d'articles et l'urgence éventuelle.",
                etapes: [
                    "Ouvrez [Demande](/employe/demande) dans le menu, puis cliquez sur [Nouvelle demande](/employe/demande/create).",
                    "Renseignez le motif de la demande.",
                    "Ajoutez les ressources souhaitées avec les quantités (ajoutez autant de lignes que nécessaire).",
                    "Cochez l'urgence si le besoin est prioritaire.",
                    "Validez : la demande est créée avec le statut « En attente » et transmise à votre chef de service.",
                ],
                astuce: "Une demande urgente est mise en évidence (fond rouge et éclair) dans la liste pour faciliter son repérage.",
            },
            {
                titre: "Consulter et suivre une demande",
                description: "Retrouvez l'historique de traitement et l'état courant d'une demande.",
                etapes: [
                    "Dans [Demande](/employe/demande), utilisez la recherche (numéro ou motif) ou le filtre par statut.",
                    "Cliquez sur une ligne pour ouvrir le détail de la demande.",
                    "Consultez le statut de la demande, le statut de chaque ligne et l'historique des traitements.",
                ],
                astuce: "Vous pouvez trier la liste par date en cliquant sur l'en-tête « Date de la demande ».",
            },
            {
                titre: "Modifier une demande",
                description: "Corrigez une demande tant qu'elle n'a pas été validée.",
                etapes: [
                    "Dans le détail d'une demande « En attente », cliquez sur le menu d'actions puis « Modifier ».",
                    "Mettez à jour le motif, les lignes ou l'urgence.",
                    "Enregistrez les modifications.",
                ],
                astuce: "La modification n'est possible que si la demande est encore « En attente ».",
            },
            {
                titre: "Supprimer une demande",
                description: "Annulez une demande déposée par erreur avant validation.",
                etapes: [
                    "Dans le menu d'actions d'une demande « En attente », cliquez sur « Supprimer ».",
                    "Confirmez la suppression dans la fenêtre de confirmation.",
                ],
                astuce: "La suppression est définitive et n'est possible que pour une demande « En attente ».",
            },
        ],
    },
    {
        id: "bon-magasin",
        titre: "Bons de magasin",
        icone: Warehouse,
        intro: "Le bon de magasin est généré à partir d'une demande validée et contrôlée. Il matérialise la sortie des articles du magasin.",
        actions: [
            {
                titre: "Créer un bon de magasin",
                description: "Générez le bon de magasin associé à une demande en bon de magasin.",
                etapes: [
                    "Depuis le détail d'une demande au statut « En bon de magasin », cliquez sur l'action de création du bon de magasin.",
                    "Vérifiez les lignes à sortir et les quantités.",
                    "Validez : le bon de magasin est créé et rattaché à la demande.",
                ],
                astuce: "Chaque ligne du bon peut faire l'objet d'une réception ultérieure par l'agent d'approvisionnement.",
            },
            {
                titre: "Consulter les bons de magasin",
                description: "Suivez les bons établis à partir de vos demandes.",
                etapes: [
                    "Ouvrez [Bon de magasin](/employe/bon-magasin) dans le menu.",
                    "Recherchez ou filtrez, puis cliquez sur un bon pour voir son détail.",
                ],
            },
        ],
    },
    {
        id: "approvisionnement",
        titre: "Approvisionnements",
        icone: ShoppingCart,
        intro: "L'approvisionnement regroupe le traitement de vos demandes : bons de magasin, achats, livraisons et réceptions.",
        actions: [
            {
                titre: "Consulter un approvisionnement",
                description: "Suivez l'avancement global du traitement de vos besoins.",
                etapes: [
                    "Ouvrez [Approvisionnement](/employe/approvisionnement) dans le menu.",
                    "Recherchez ou filtrez la liste, puis cliquez sur une ligne pour ouvrir le détail.",
                    "Consultez les branches (bons de magasin, achats) et leur avancement.",
                ],
                astuce: "Le statut « En cours (partiel) » indique que certaines lignes sont traitées et d'autres encore en attente.",
            },
        ],
    },
    {
        id: "livraison",
        titre: "Livraisons et réception",
        icone: Truck,
        intro: "Lorsque les articles sont prêts, ils sont livrés. Vous réceptionnez la livraison pour confirmer la remise.",
        actions: [
            {
                titre: "Consulter les livraisons",
                description: "Suivez les livraisons liées à vos bons de magasin.",
                etapes: [
                    "Ouvrez [Livraison](/employe/livraison) dans le menu.",
                    "Cliquez sur une livraison pour consulter son détail et ses articles.",
                ],
            },
            {
                titre: "Réceptionner une livraison",
                description: "Confirmez la réception des articles livrés.",
                etapes: [
                    "Depuis le détail d'une livraison, cliquez sur l'action de réception.",
                    "Renseignez les quantités reçues pour chaque ligne.",
                    "Validez : la réception est enregistrée et le traitement se met à jour.",
                ],
                astuce: "Une réception partielle laisse la livraison ouverte pour le solde des articles.",
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
                description: "Vérifiez vos informations d'identité rattachées à votre compte.",
                etapes: [
                    "Ouvrez [Profil](/employe/profil) dans le menu.",
                    "Consultez vos informations (nom, prénom, service, responsabilité).",
                ],
            },
            {
                titre: "Changer mon mot de passe",
                description: "Mettez à jour votre mot de passe de connexion.",
                etapes: [
                    "Depuis [Profil](/employe/profil), ouvrez [Changer le mot de passe](/employe/profil/mot-de-passe).",
                    "Saisissez votre ancien mot de passe puis le nouveau.",
                    "Confirmez pour enregistrer le changement.",
                ],
                astuce: "Choisissez un mot de passe suffisamment long et difficile à deviner.",
            },
        ],
    },
];
