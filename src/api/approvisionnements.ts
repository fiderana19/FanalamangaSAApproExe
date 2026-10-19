import axiosAuthInstance from "./Config";
import {
  AnnulerApprovisionnementInterface,
  ManageApprovisionnementInterface,
} from "@/interfaces/Approvisionnement";
import { BASE_URL } from "@/config/appConfig";

const ApprovisionnementAPIUrl = `${BASE_URL}/approvisionnement`;

export const createApprovisionnement = async (data: ManageApprovisionnementInterface) => {
  return await axiosAuthInstance.post(`${ApprovisionnementAPIUrl}`, data);
}

export const getApprovisionnements = async () => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}`);
}

export const getMesApprovisionnements = async () => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/mine`);
}

export const getApprovisionnementsService = async () => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/service`);
}

export const getApprovisionnementParBon = async (bonMagasinId: string) => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/bon/${bonMagasinId}`);
}

export const getApprovisionnement = async (id: string) => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/${id}`);
}

export const annulerApprovisionnement = async (
  id: string,
  data: AnnulerApprovisionnementInterface,
) => {
  return await axiosAuthInstance.patch(
    `${ApprovisionnementAPIUrl}/${id}/annuler`,
    data,
  );
}

export const getTraitementsAppro = async (id: string) => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/traitement/${id}`);
}

export const getHistoriqueTraitementsAppro = async () => {
  return await axiosAuthInstance.get(`${ApprovisionnementAPIUrl}/traitement/historique`);
}
