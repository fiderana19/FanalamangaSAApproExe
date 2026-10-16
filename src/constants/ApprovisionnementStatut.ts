import {
  ClipboardCheck,
  Hourglass,
  PackageCheck,
  ShoppingCart,
  ShoppingBag,
  Split,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const APPROVISIONNEMENT_STATUT_LABELS: Record<string, string> = {
  en_cours: "En cours",
  en_cours_partiel: "En cours (partiel)",
  en_cours_achat: "En cours d'achat",
  achat_recu: "Achat reçu",
  pret_a_livrer: "Prêt pour la livraison",
  en_livraison: "En livraison",
  partiellement_recu: "Partiellement reçu",
  recu: "Reçu",
  pret_a_livrer_en_cours_achat: "Prêt pour la livraison - en cours d'achat",
  pret_a_livrer_achat_recu: "Prêt pour la livraison - achat reçu",
  en_livraison_en_cours_achat: "En livraison - en cours d'achat",
  en_livraison_achat_recu: "En livraison - achat reçu",
  partiellement_recu_en_cours_achat: "Partiellement reçu - en cours d'achat",
  partiellement_recu_achat_recu: "Partiellement reçu - achat reçu",
}

export const APPROVISIONNEMENT_STATUTS = Object.keys(APPROVISIONNEMENT_STATUT_LABELS)

export const getApprovisionnementStatutLabel = (statut?: string) =>
  statut ? APPROVISIONNEMENT_STATUT_LABELS[statut] ?? statut : ""

const APPROVISIONNEMENT_STATUT_DISPLAY_OVERRIDES: Record<string, string> = {
  en_cours_partiel: "En cours (partiel)",
  en_cours_achat: "En cours (partiel)",
  partiellement_recu: "En cours (partiel)",
  partiellement_recu_en_cours_achat: "En cours (partiel)",
  partiellement_recu_achat_recu: "En cours (partiel)",
  pret_a_livrer_en_cours_achat: "En cours (partiel)",
  pret_a_livrer_achat_recu: "En cours (partiel)",
  en_livraison_en_cours_achat: "En cours (partiel)",
  en_livraison_achat_recu: "En cours (partiel)",
}

export const getApprovisionnementStatutDisplayLabel = (statut?: string) =>
  statut
    ? APPROVISIONNEMENT_STATUT_DISPLAY_OVERRIDES[statut] ??
      getApprovisionnementStatutLabel(statut)
    : ""

export interface ApprovisionnementStatutMeta {
  icon: LucideIcon;
  badge: string;
  dot: string;
}

export const APPROVISIONNEMENT_STATUT_META: Record<string, ApprovisionnementStatutMeta> = {
  en_cours: { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
  en_cours_partiel: { icon: Split, badge: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  en_cours_achat: { icon: ShoppingCart, badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  achat_recu: { icon: ShoppingBag, badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  pret_a_livrer: { icon: PackageCheck, badge: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-500" },
  en_livraison: { icon: Truck, badge: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  partiellement_recu: { icon: PackageCheck, badge: "bg-cyan-50 text-cyan-700", dot: "bg-cyan-500" },
  recu: { icon: ClipboardCheck, badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
  pret_a_livrer_en_cours_achat: { icon: ShoppingCart, badge: "bg-teal-50 text-teal-700", dot: "bg-teal-500" },
  pret_a_livrer_achat_recu: { icon: PackageCheck, badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  en_livraison_en_cours_achat: { icon: Truck, badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  en_livraison_achat_recu: { icon: Truck, badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  partiellement_recu_en_cours_achat: { icon: Split, badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  partiellement_recu_achat_recu: { icon: PackageCheck, badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
}

export const getApprovisionnementStatutMeta = (statut?: string): ApprovisionnementStatutMeta =>
  statut && APPROVISIONNEMENT_STATUT_META[statut]
    ? APPROVISIONNEMENT_STATUT_META[statut]
    : { icon: Hourglass, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }
