import axiosAuthInstance from "./Config";
import { BASE_URL } from "@/config/appConfig";
import {
  ManageBonSortieInterface,
  SortieStatutType,
} from "@/interfaces/BonSortie";

const BonSortieAPIUrl = `${BASE_URL}/bon-sortie`;

export const createBonSortie = async (data: ManageBonSortieInterface) => {
  return await axiosAuthInstance.post(`${BonSortieAPIUrl}`, data);
}

export const getBonSorties = async () => {
  return await axiosAuthInstance.get(`${BonSortieAPIUrl}`);
}

export const getBonSortie = async (id: string) => {
  return await axiosAuthInstance.get(`${BonSortieAPIUrl}/${id}`);
}

export const getBonSortieByAppro = async (approvisionnementId: string) => {
  return await axiosAuthInstance.get(
    `${BonSortieAPIUrl}/approvisionnement/${approvisionnementId}`,
  );
}

export const changerStatutBonSortie = async (
  id: string,
  statut: SortieStatutType,
) => {
  return await axiosAuthInstance.patch(`${BonSortieAPIUrl}/${id}/statut`, {
    statut,
  });
}