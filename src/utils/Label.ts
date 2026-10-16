import { ServiceRef, ResponsabiliteRef } from "@/interfaces/User";

export const getServiceLabel = (service: ServiceRef | string | null | undefined) => {
  if (service && typeof service === "object") {
    return service.nomService || service.sigleService || "";
  }
  return "";
};

export const getResponsabiliteLabel = (
  responsabilite: ResponsabiliteRef | string | null | undefined
) => {
  if (responsabilite && typeof responsabilite === "object") {
    return responsabilite.libelle || "";
  }
  return "";
};