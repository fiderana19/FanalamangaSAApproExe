export const CHART_COLORS = [
    "#1f7a4d",
    "#2d9864",
    "#f3c64d",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#6366f1",
    "#ec4899",
];

export const CHART_BRAND = "#1f7a4d";
export const CHART_GRID = "#e5e7eb";
export const CHART_TEXT = "#6b7280";

export const MOIS_LABELS_FR = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
];

export const STATUT_CHART_COLORS: Record<string, string> = {
    en_attente: "#f59e0b",
    validee: "#10b981",
    refusee: "#ef4444",
    controlee: "#3b82f6",
    refusee_controle: "#f43f5e",
    en_bon_magasin: "#14b8a6",
    conforme: "#10b981",
    non_conforme: "#f43f5e",
    en_cours: "#f59e0b",
    termine: "#22c55e",
    livree: "#14b8a6",
    en_cours_achat: "#f97316",
    achat_recu: "#f59e0b",
    pret_a_livrer: "#6366f1",
    en_livraison: "#0ea5e9",
    partiellement_recu: "#06b6d4",
    recu: "#22c55e",
    en_preparation: "#f59e0b",
    sorti: "#14b8a6",
    annule: "#ef4444",
};

export const getStatutChartColor = (statut?: string, fallbackIndex = 0) =>
    statut && STATUT_CHART_COLORS[statut]
        ? STATUT_CHART_COLORS[statut]
        : CHART_COLORS[fallbackIndex % CHART_COLORS.length];
