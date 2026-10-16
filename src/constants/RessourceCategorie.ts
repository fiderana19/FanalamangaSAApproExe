import {
  Armchair,
  HardHat,
  Monitor,
  PackageOpen,
  PenTool,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIE_LABELS: Record<string, string> = {
    vehicule: "Véhicule",
    equipement_protection: "Équipement de protection",
    fourniture_bureau: "Fourniture de bureau",
    outillage: "Outillage",
    informatique: "Informatique",
    mobilier: "Mobilier",
    consommable: "Consommable",
}

export const CATEGORIES = Object.keys(CATEGORIE_LABELS)

export const getCategorieLabel = (categorie?: string) =>
    categorie ? CATEGORIE_LABELS[categorie] ?? categorie : ""

export interface CategorieMeta {
    icon: LucideIcon;
    badge: string;
    dot: string;
}

export const CATEGORIE_META: Record<string, CategorieMeta> = {
    vehicule: { icon: Truck, badge: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
    equipement_protection: { icon: HardHat, badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
    fourniture_bureau: { icon: PenTool, badge: "bg-purple-50 text-purple-600", dot: "bg-purple-500" },
    outillage: { icon: Wrench, badge: "bg-orange-50 text-orange-600", dot: "bg-orange-500" },
    informatique: { icon: Monitor, badge: "bg-indigo-50 text-indigo-600", dot: "bg-indigo-500" },
    mobilier: { icon: Armchair, badge: "bg-teal-50 text-teal-600", dot: "bg-teal-500" },
    consommable: { icon: PackageOpen, badge: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
}

export const getCategorieMeta = (categorie?: string): CategorieMeta =>
    categorie && CATEGORIE_META[categorie]
        ? CATEGORIE_META[categorie]
        : { icon: PackageOpen, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }