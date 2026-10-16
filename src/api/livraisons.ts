import axiosAuthInstance from "./Config";
import { LivraisonStatutType } from "@/interfaces/Livraison";
import { BASE_URL } from "@/config/appConfig";

const LivraisonAPIUrl = `${BASE_URL}/livraison`;

export const getLivraisons = async () => {
  return await axiosAuthInstance.get(`${LivraisonAPIUrl}`);
};

export const getMesLivraisons = async () => {
  return await axiosAuthInstance.get(`${LivraisonAPIUrl}/mine`);
};

export const getLivraisonsService = async () => {
  return await axiosAuthInstance.get(`${LivraisonAPIUrl}/service`);
};

export const getLivraisonsParSortie = async (sortieId: string) => {
  return await axiosAuthInstance.get(`${LivraisonAPIUrl}/sortie/${sortieId}`);
};

export const getLivraison = async (id: string) => {
  return await axiosAuthInstance.get(`${LivraisonAPIUrl}/${id}`);
};

export const changerStatutLivraison = async (
  id: string,
  statut: LivraisonStatutType,
) => {
  return await axiosAuthInstance.patch(`${LivraisonAPIUrl}/${id}/statut`, {
    statut,
  });
};
