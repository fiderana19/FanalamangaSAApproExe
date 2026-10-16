import {
  CheckCircle2,
  Hourglass,
  PackageOpen,
  Send,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { StatutMeta } from "./DemandeStatut";

export const BON_MAGASIN_STATUT_LABELS: Record<string, string> = {
    etabli: "Établi",
    transmis: "Transmis",
    annule: "Annulé",
}

export const BON_MAGASIN_STATUTS = Object.keys(BON_MAGASIN_STATUT_LABELS)

export const getBonMagasinStatutLabel = (statut?: string) =>
    statut ? BON_MAGASIN_STATUT_LABELS[statut] ?? statut : ""

export const BON_MAGASIN_STATUT_META: Record<string, StatutMeta> = {
    etabli: { icon: CheckCircle2, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
    transmis: { icon: Send, badge: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
    annule: { icon: XCircle, badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
}

export const getBonMagasinStatutMeta = (statut?: string): StatutMeta =>
    statut && BON_MAGASIN_STATUT_META[statut]
        ? BON_MAGASIN_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }

// Statuts pour les lignes de bon de magasin
export const LIGNE_BON_MAGASIN_STATUT_LABELS: Record<string, string> = {
    etabli: "Établi",
    transmis: "Transmis",
    en_bon_sortie: "En bon de sortie",
    en_cours_achat: "En cours d'achat",
    achat_recu: "Achat reçu",
}

export const LIGNE_BON_MAGASIN_STATUTS = Object.keys(LIGNE_BON_MAGASIN_STATUT_LABELS)

export const getLigneBonMagasinStatutLabel = (statut?: string) =>
    statut ? LIGNE_BON_MAGASIN_STATUT_LABELS[statut] ?? statut : ""

export const LIGNE_BON_MAGASIN_STATUT_META: Record<string, StatutMeta> = {
    etabli: { icon: CheckCircle2, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
    transmis: { icon: Send, badge: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
    en_bon_sortie: { icon: PackageOpen, badge: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-500" },
    en_cours_achat: { icon: ShoppingCart, badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
    achat_recu: { icon: Truck, badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
}

export const getLigneBonMagasinStatutMeta = (statut?: string): StatutMeta =>
    statut && LIGNE_BON_MAGASIN_STATUT_META[statut]
        ? LIGNE_BON_MAGASIN_STATUT_META[statut]
        : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }