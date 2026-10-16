import type { LucideIcon } from "lucide-react";

export interface HistoriqueStatutMetaInterface {
  icon: LucideIcon;
  badge: string;
  dot: string;
}

export type HistoriqueBrancheType = "commun" | "bsm" | "achat";

export const ACHAT_LANE = "achat";

export type HistoriqueItemInterface = {
  id: string;
  titre: string;
  sousTitre?: string;
  date: string;
  commentaire?: string | null;
  meta: HistoriqueStatutMetaInterface;
  branche?: HistoriqueBrancheType;
  lane?: string;
};

export const formatDateHistorique = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
