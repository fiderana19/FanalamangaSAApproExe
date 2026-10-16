import { PackageCheck, PackageOpen, PackageX, Truck } from "lucide-react";
import { StatutMeta } from "./DemandeStatut";

export const LIGNE_SORTIE_STATUT_LABELS: Record<string, string> = {
  en_bon_sortie: "En bon de sortie",
  en_livraison: "En livraison",
  livree: "Livrée",
  non_recu: "Non reçu",
};

export const LIGNE_SORTIE_STATUTS = Object.keys(LIGNE_SORTIE_STATUT_LABELS);

export const getLigneSortieStatutLabel = (statut?: string) =>
  statut ? LIGNE_SORTIE_STATUT_LABELS[statut] ?? statut : "";

export const LIGNE_SORTIE_STATUT_META: Record<string, StatutMeta> = {
  en_bon_sortie: {
    icon: PackageOpen,
    badge: "bg-gray-50 text-gray-600",
    dot: "bg-gray-400",
  },
  en_livraison: {
    icon: Truck,
    badge: "bg-sky-50 text-sky-600",
    dot: "bg-sky-500",
  },
  livree: {
    icon: PackageCheck,
    badge: "bg-teal-50 text-teal-600",
    dot: "bg-teal-500",
  },
  non_recu: {
    icon: PackageX,
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

export const getLigneSortieStatutMeta = (statut?: string): StatutMeta =>
  statut && LIGNE_SORTIE_STATUT_META[statut]
    ? LIGNE_SORTIE_STATUT_META[statut]
    : {
        icon: PackageOpen,
        badge: "bg-gray-50 text-gray-600",
        dot: "bg-gray-400",
      };
