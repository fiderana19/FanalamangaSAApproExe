export const ROLE_LABELS: Record<string, string> = {
    employe: "Employé",
    chef_service: "Chef de service",
    controleur_gestion: "Contrôleur de gestion",
    agent_appro: "Agent approvisionnement",
    admin: "Administrateur",
}

export const ROLE_HOME_PATH: Record<string, string> = {
    admin: "/admin",
    employe: "/employe",
    chef_service: "/chef_service",
    controleur_gestion: "/controleur_gestion",
    agent_appro: "/agent_appro",
}

export const NON_ADMIN_ROLES = Object.keys(ROLE_LABELS).filter((role) => role !== "admin");

export const getRoleLabel = (role?: string) => role ? ROLE_LABELS[role] ?? role : "Utilisateur";