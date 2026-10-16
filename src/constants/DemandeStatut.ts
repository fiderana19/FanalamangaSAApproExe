import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Hourglass,
  PackageX,
  Plus,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export const DEMANDE_STATUT_LABELS: Record<string, string> = {
    en_attente: "En attente",
    validee: "Validée",
    refusee: "Refusée interne",
    controlee: "Contrôlée",
    refusee_controle: "Refusée au contrôle",
    en_bon_magasin: "En bon de magasin",
}

export const DEMANDE_STATUTS = Object.keys(DEMANDE_STATUT_LABELS)

export const getDemandeStatutLabel = (statut?: string) =>
    statut ? DEMANDE_STATUT_LABELS[statut] ?? statut : ""

export interface StatutMeta {
    icon: LucideIcon;
    badge: string;
    dot: string;
}

export const DEMANDE_STATUT_META: Record<string, StatutMeta> = {
    en_attente: { icon: Clock, badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    validee: { icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    refusee: { icon: PackageX, badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
    controlee: { icon: ClipboardCheck, badge: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
    refusee_controle: { icon: PackageX, badge: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
    en_bon_magasin: { icon: Warehouse, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
}

export const getDemandeStatutMeta = (statut?: string): StatutMeta =>
    statut && DEMANDE_STATUT_META[statut]
        ? DEMANDE_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }

export const LIGNE_STATUT_LABELS: Record<string, string> = {
    en_attente: "En attente",
    validee: "Validée",
    refusee_interne: "Refusée interne",
    controlee: "Contrôlée",
    non_conforme: "Non conforme",
    en_bon_magasin: "En bon de magasin",
}

export const LIGNE_STATUTS = Object.keys(LIGNE_STATUT_LABELS)

export const getLigneStatutLabel = (statut?: string) =>
    statut ? LIGNE_STATUT_LABELS[statut] ?? statut : ""

export const LIGNE_STATUT_META: Record<string, StatutMeta> = {
    en_attente: { icon: Clock, badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    validee: { icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    refusee_interne: { icon: PackageX, badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
    controlee: { icon: ClipboardCheck, badge: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
    non_conforme: { icon: PackageX, badge: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
    en_bon_magasin: { icon: Warehouse, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
}

export const getLigneStatutMeta = (statut?: string): StatutMeta =>
    statut && LIGNE_STATUT_META[statut]
        ? LIGNE_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }

export const TRAITEMENT_STATUT_LABELS: Record<string, string> = {
    cree: "Demande créée",
    valide: "Demande validée",
    refuse: "Demande refusée",
    controle_conforme: "Demande contrôlée conforme",
    controle_non_conforme: "Demande non conforme",
    bon_magasin_etabli: "Bon de magasin établi",
}

export const TRAITEMENT_STATUTS = Object.keys(TRAITEMENT_STATUT_LABELS)

export const getTraitementStatutLabel = (statut?: string) =>
    statut ? TRAITEMENT_STATUT_LABELS[statut] ?? statut : ""

export const TRAITEMENT_STATUT_META: Record<string, StatutMeta> = {
    cree: { icon: Plus, badge: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
    valide: { icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    refuse: { icon: PackageX, badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
    controle_conforme: { icon: ClipboardCheck, badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
    controle_non_conforme: { icon: PackageX, badge: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
    bon_magasin_etabli: { icon: Warehouse, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
}

export const getTraitementStatutMeta = (statut?: string): StatutMeta =>
    statut && TRAITEMENT_STATUT_META[statut]
        ? TRAITEMENT_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }
