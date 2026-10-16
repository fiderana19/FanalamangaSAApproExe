import axiosAuthInstance from "./Config";
import { BASE_URL } from "@/config/appConfig";
import {
  DemandeAchatStatutType,
  ManageDemandeAchatInterface,
} from "@/interfaces/DemandeAchat";

const DemandeAchatAPIUrl = `${BASE_URL}/demande-achat`;

export const createDemandeAchat = async (data: ManageDemandeAchatInterface) => {
  return await axiosAuthInstance.post(`${DemandeAchatAPIUrl}`, data);
}

export const getDemandeAchats = async () => {
  return await axiosAuthInstance.get(`${DemandeAchatAPIUrl}`);
}

export const getDemandeAchat = async (id: string) => {
  return await axiosAuthInstance.get(`${DemandeAchatAPIUrl}/${id}`);
}

export const getDemandeAchatByAppro = async (approvisionnementId: string) => {
  return await axiosAuthInstance.get(
    `${DemandeAchatAPIUrl}/approvisionnement/${approvisionnementId}`,
  );
}

export const changerStatutDemandeAchat = async (
  id: string,
  statut: DemandeAchatStatutType,
) => {
  return await axiosAuthInstance.patch(`${DemandeAchatAPIUrl}/${id}/statut`, {
    statut,
  });
}

export const getStatutsDemandeAchat = async (id: string) => {
  return await axiosAuthInstance.get(`${DemandeAchatAPIUrl}/${id}/statut`);
}

export const getHistoriqueStatutsDemandeAchat = async () => {
  return await axiosAuthInstance.get(`${DemandeAchatAPIUrl}/statut/historique`);
}
