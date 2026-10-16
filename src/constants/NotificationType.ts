export const NOTIFICATION_TYPE = {
    VALIDATION: "validation",
    REFUS: "refus",
    CONTROLE: "controle",
    APPROVISIONNEMENT: "approvisionnement",
    ACHAT: "achat",
    LIVRAISON: "livraison",
    RECEPTION: "reception",
    ALERTE: "alerte",
} as const;

export const NOTIFICATION_TYPE_STYLE: Record<string, string> = {
    [NOTIFICATION_TYPE.VALIDATION]: "bg-emerald-100 text-emerald-700",
    [NOTIFICATION_TYPE.REFUS]: "bg-red-100 text-red-700",
    [NOTIFICATION_TYPE.CONTROLE]: "bg-blue-100 text-blue-700",
    [NOTIFICATION_TYPE.APPROVISIONNEMENT]: "bg-indigo-100 text-indigo-700",
    [NOTIFICATION_TYPE.ACHAT]: "bg-amber-100 text-amber-700",
    [NOTIFICATION_TYPE.LIVRAISON]: "bg-cyan-100 text-cyan-700",
    [NOTIFICATION_TYPE.RECEPTION]: "bg-teal-100 text-teal-700",
    [NOTIFICATION_TYPE.ALERTE]: "bg-orange-100 text-orange-700",
};

export const NOTIFICATION_TYPE_LABEL: Record<string, string> = {
    [NOTIFICATION_TYPE.VALIDATION]: "Validation",
    [NOTIFICATION_TYPE.REFUS]: "Refus",
    [NOTIFICATION_TYPE.CONTROLE]: "Contrôle",
    [NOTIFICATION_TYPE.APPROVISIONNEMENT]: "Approvisionnement",
    [NOTIFICATION_TYPE.ACHAT]: "Achat",
    [NOTIFICATION_TYPE.LIVRAISON]: "Livraison",
    [NOTIFICATION_TYPE.RECEPTION]: "Réception",
    [NOTIFICATION_TYPE.ALERTE]: "Alerte",
};

export const getNotificationTypeLabel = (type: string) =>
    NOTIFICATION_TYPE_LABEL[type] ?? type;
