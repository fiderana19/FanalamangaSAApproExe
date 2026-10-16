import { RessourceRef } from "@/interfaces/Demande";

export const getRessource = (
  ressource: RessourceRef | string | null | undefined
): RessourceRef | null =>
  ressource && typeof ressource === "object" ? ressource : null;

export const getReference = (ressource: RessourceRef | string | null | undefined): string =>
  getRessource(ressource)?.reference ?? "";