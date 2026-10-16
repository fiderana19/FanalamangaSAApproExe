import { CheckCircle2, Loader, type LucideIcon } from "lucide-react";

export const DEMANDE_ACHAT_STATUT_LABELS: Record<string, string> = {
  en_cours: "En cours",
  termine: "Terminé",
}

export const DEMANDE_ACHAT_STATUTS = Object.keys(DEMANDE_ACHAT_STATUT_LABELS)

export const getDemandeAchatStatutLabel = (statut?: string) =>
  statut ? DEMANDE_ACHAT_STATUT_LABELS[statut] ?? statut : ""

export interface DemandeAchatStatutMeta {
  icon: LucideIcon;
  badge: string;
  dot: string;
}

export const DEMANDE_ACHAT_STATUT_META: Record<string, DemandeAchatStatutMeta> = {
  en_cours: { icon: Loader, badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  termine: { icon: CheckCircle2, badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
}

export const getDemandeAchatStatutMeta = (statut?: string): DemandeAchatStatutMeta =>
  statut && DEMANDE_ACHAT_STATUT_META[statut]
    ? DEMANDE_ACHAT_STATUT_META[statut]
    : { icon: Loader, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }
