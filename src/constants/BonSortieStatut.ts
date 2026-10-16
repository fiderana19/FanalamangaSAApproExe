import {
  Hourglass,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { StatutMeta } from "./DemandeStatut";

export const BON_SORTIE_STATUT_LABELS: Record<string, string> = {
    en_preparation: "En préparation",
    sorti: "Sorti",
    annule: "Annulé",
}

export const BON_SORTIE_STATUTS = Object.keys(BON_SORTIE_STATUT_LABELS)

export const getBonSortieStatutLabel = (statut?: string) =>
    statut ? BON_SORTIE_STATUT_LABELS[statut] ?? statut : ""

export const BON_SORTIE_STATUT_META: Record<string, StatutMeta> = {
    en_preparation: { icon: Hourglass, badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    sorti: { icon: PackageCheck, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
    annule: { icon: XCircle, badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
}

export const getBonSortieStatutMeta = (statut?: string): StatutMeta =>
    statut && BON_SORTIE_STATUT_META[statut]
        ? BON_SORTIE_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }

export const APUREMENT_LABELS: Record<string, string> = {
    total: "Total",
    partiel: "Partiel",
}

export const APUREMENT_META: Record<string, { badge: string; dot: string }> = {
    total: { badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    partiel: { badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
}

export const getApurementLabel = (apurement?: string) =>
    apurement ? APUREMENT_LABELS[apurement] ?? apurement : ""