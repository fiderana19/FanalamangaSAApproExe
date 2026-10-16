import { UniteRessource } from "@/constants/UniteRessource";

export const UNITE_LABELS: Record<string, string> = {
    [UniteRessource.Piece]: "Pièce",
    [UniteRessource.Paire]: "Paire",
    [UniteRessource.Litre]: "Litre",
    [UniteRessource.Kilogramme]: "Kilogramme",
    [UniteRessource.Metre]: "Mètre",
    [UniteRessource.MetreCube]: "Mètre cube",
    [UniteRessource.Rouleau]: "Rouleau",
    [UniteRessource.Boite]: "Boîte",
    [UniteRessource.Bidon]: "Bidon",
    [UniteRessource.Sac]: "Sac",
}

export const UNITES: string[] = Object.values(UniteRessource)

export const getUniteLabel = (unite?: string) =>
    unite ? UNITE_LABELS[unite] ?? unite : ""