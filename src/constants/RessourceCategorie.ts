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
    vehicule: { icon: Truck, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    equipement_protection: { icon: HardHat, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    fourniture_bureau: { icon: PenTool, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    outillage: { icon: Wrench, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    informatique: { icon: Monitor, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    mobilier: { icon: Armchair, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
    consommable: { icon: PackageOpen, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" },
}

export const getCategorieMeta = (categorie?: string): CategorieMeta =>
    categorie && CATEGORIE_META[categorie]
        ? CATEGORIE_META[categorie]
        : { icon: PackageOpen, badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" }