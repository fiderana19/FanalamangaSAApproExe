import axiosAuthInstance from "./Config";
import { ManageBonMagasinInterface } from "@/interfaces/BonMagasin";
import { BASE_URL } from "@/config/appConfig";

const BonMagasinAPIUrl = `${BASE_URL}/bon-magasin`;

export const createBonMagasin = async (data: ManageBonMagasinInterface) => {
  return await axiosAuthInstance.post(`${BonMagasinAPIUrl}`, data);
}

export const getMesBonsMagasin = async () => {
  return await axiosAuthInstance.get(`${BonMagasinAPIUrl}/mine`);
}

export const getBonsMagasinService = async () => {
  return await axiosAuthInstance.get(`${BonMagasinAPIUrl}/service`);
}

export const getBonsMagasinAll = async () => {
  return await axiosAuthInstance.get(`${BonMagasinAPIUrl}`);
}

export const getBonMagasin = async (id: string) => {
  return await axiosAuthInstance.get(`${BonMagasinAPIUrl}/${id}`);
}

export const getBonMagasinByDemande = async (demandeId: string) => {
  return await axiosAuthInstance.get(`${BonMagasinAPIUrl}/demande/${demandeId}`);
}