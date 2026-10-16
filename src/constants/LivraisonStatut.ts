import { PackageCheck, Truck } from "lucide-react";
import { StatutMeta } from "./DemandeStatut";

export const LIVRAISON_STATUT_LABELS: Record<string, string> = {
  en_cours: "En cours de livraison",
  livree: "Livrée",
};

export const LIVRAISON_STATUTS = Object.keys(LIVRAISON_STATUT_LABELS);

export const getLivraisonStatutLabel = (statut?: string) =>
  statut ? LIVRAISON_STATUT_LABELS[statut] ?? statut : "";

export const LIVRAISON_STATUT_META: Record<string, StatutMeta> = {
  en_cours: {
    icon: Truck,
    badge: "bg-sky-50 text-sky-600",
    dot: "bg-sky-500",
  },
  livree: {
    icon: PackageCheck,
    badge: "bg-teal-50 text-teal-600",
    dot: "bg-teal-500",
  },
};

export const getLivraisonStatutMeta = (statut?: string): StatutMeta =>
  statut && LIVRAISON_STATUT_META[statut]
    ? LIVRAISON_STATUT_META[statut]
    : { icon: Truck, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" };
