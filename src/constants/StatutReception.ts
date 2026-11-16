import { CircleCheck, CircleX, Clock, RefreshCw } from "lucide-react";
import { StatutMeta } from "./DemandeStatut";

export const STATUT_RECEPTION_LABELS: Record<string, string> = {
  en_attente: "En attente",
  conforme: "Conforme",
  non_conforme: "Non conforme",
  regularisee: "Régularisée",
};

export const STATUT_RECEPTION_STATUTS = Object.keys(STATUT_RECEPTION_LABELS);

export const getStatutReceptionLabel = (statut?: string) =>
  statut ? STATUT_RECEPTION_LABELS[statut] ?? statut : "";

export const STATUT_RECEPTION_META: Record<string, StatutMeta> = {
  en_attente: {
    icon: Clock,
    badge: "bg-gray-50 text-gray-600",
    dot: "bg-gray-400",
  },
  conforme: {
    icon: CircleCheck,
    badge: "bg-teal-50 text-teal-600",
    dot: "bg-teal-500",
  },
  non_conforme: {
    icon: CircleX,
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  regularisee: {
    icon: RefreshCw,
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
};

export const getStatutReceptionMeta = (statut?: string): StatutMeta =>
  statut && STATUT_RECEPTION_META[statut]
    ? STATUT_RECEPTION_META[statut]
    : { icon: Clock, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" };
