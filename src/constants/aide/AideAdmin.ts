import {
    Building2,
    Tag,
    User,
    Users,
    Workflow,
} from "lucide-react";
import { AideSection } from "@/interfaces/Aide";

export const AIDE_ADMIN: AideSection[] = [
    {
        id: "administration",
        titre: "Votre rôle d'administrateur",
        icone: Workflow,
        intro: "Administrateur, vous configurez le référentiel de l'application : services, responsabilités et comptes utilisateurs.",
        actions: [
            {
                titre: "Périmètre d'administration",
                description: "Vous gérez les données de base nécessaires au fonctionnement de l'application.",
                etapes: [
                    "Créez et maintenez les services de l'entreprise.",
                    "Créez et maintenez les responsabilités rattachées aux services.",
                    "Créez et maintenez les comptes utilisateurs et leurs rôles.",
                ],
                astuce: "Un service et une responsabilité doivent exister avant de pouvoir créer un compte associé.",
            },
        ],
    },
    {
        id: "services",
        titre: "Services",
        icone: Building2,
        intro: "Les services structurent l'organisation et déterminent le rattachement des utilisateurs.",
        actions: [
            {
                titre: "Consulter les services",
                description: "Parcourez la liste des services.",
                etapes: [
                    "Ouvrez [Service](/admin/service) dans le menu.",
                    "Cliquez sur un service pour consulter sa fiche.",
                ],
            },
            {
                titre: "Créer un service",
                description: "Ajoutez un nouveau service.",
                etapes: [
                    "Depuis [Service](/admin/service), cliquez sur [Nouveau service](/admin/service/create).",
                    "Renseignez les informations du service.",
                    "Enregistrez le service.",
                ],
            },
            {
                titre: "Modifier un service",
                description: "Mettez à jour les informations d'un service existant.",
                etapes: [
                    "Depuis la fiche d'un service, cliquez sur « Modifier ».",
                    "Mettez à jour les champs souhaités.",
                    "Enregistrez les modifications.",
                ],
            },
        ],
    },
    {
        id: "responsabilites",
        titre: "Responsabilités",
        icone: Tag,
        intro: "Les responsabilités précisent la fonction occupée par un utilisateur au sein d'un service.",
        actions: [
            {
                titre: "Consulter les responsabilités",
                description: "Parcourez la liste des responsabilités.",
                etapes: [
                    "Ouvrez [Responsabilité](/admin/responsabilite) dans le menu.",
                    "Cliquez sur une responsabilité pour consulter sa fiche.",
                ],
            },
            {
                titre: "Créer une responsabilité",
                description: "Ajoutez une nouvelle responsabilité.",
                etapes: [
                    "Depuis [Responsabilité](/admin/responsabilite), cliquez sur [Nouvelle responsabilité](/admin/responsabilite/create).",
                    "Renseignez les informations de la responsabilité.",
                    "Enregistrez la responsabilité.",
                ],
            },
            {
                titre: "Modifier une responsabilité",
                description: "Mettez à jour une responsabilité existante.",
                etapes: [
                    "Depuis la fiche d'une responsabilité, cliquez sur « Modifier ».",
                    "Mettez à jour les champs souhaités.",
                    "Enregistrez les modifications.",
                ],
            },
        ],
    },
    {
        id: "comptes",
        titre: "Comptes utilisateurs",
        icone: Users,
        intro: "Créez et gérez les comptes, leurs rôles et leurs rattachements (service et responsabilité).",
        actions: [
            {
                titre: "Consulter les comptes",
                description: "Parcourez la liste des utilisateurs.",
                etapes: [
                    "Ouvrez [Compte](/admin/compte) dans le menu.",
                    "Recherchez ou filtrez la liste.",
                    "Cliquez sur un compte pour consulter sa fiche.",
                ],
            },
            {
                titre: "Créer un compte",
                description: "Ajoutez un nouvel utilisateur et lui attribuez un rôle.",
                etapes: [
                    "Depuis [Compte](/admin/compte), cliquez sur [Nouveau compte](/admin/compte/create).",
                    "Renseignez l'identité, les coordonnées, le rôle, le service et la responsabilité.",
                    "Enregistrez le compte : l'utilisateur peut alors se connecter avec les identifiants définis.",
                ],
                astuce: "Le rôle attribué détermine l'espace et les fonctionnalités accessibles à l'utilisateur.",
            },
            {
                titre: "Modifier un compte",
                description: "Mettez à jour les informations ou le rôle d'un compte.",
                etapes: [
                    "Depuis la fiche d'un compte, cliquez sur « Modifier ».",
                    "Mettez à jour les informations ou le rôle.",
                    "Enregistrez les modifications.",
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
                    "Ouvrez [Profil](/admin/profil) dans le menu.",
                    "Consultez vos informations personnelles.",
                ],
            },
            {
                titre: "Changer mon mot de passe",
                description: "Mettez à jour votre mot de passe de connexion.",
                etapes: [
                    "Depuis [Profil](/admin/profil), ouvrez [Changer le mot de passe](/admin/profil/mot-de-passe).",
                    "Saisissez votre ancien mot de passe puis le nouveau.",
                    "Confirmez pour enregistrer le changement.",
                ],
                astuce: "Choisissez un mot de passe suffisamment long et difficile à deviner.",
            },
        ],
    },
];
