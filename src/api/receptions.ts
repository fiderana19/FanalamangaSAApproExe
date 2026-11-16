import axiosAuthInstance from "./Config";
import {
  ManageReceptionInterface,
  ManageRegularisationInterface,
} from "@/interfaces/Reception";
import { BASE_URL } from "@/config/appConfig";

const ReceptionAPIUrl = `${BASE_URL}/reception`;

export const createReception = async (data: ManageReceptionInterface) => {
  return await axiosAuthInstance.post(`${ReceptionAPIUrl}`, data);
};

export const getAnomaliesParSortie = async (sortieId: string) => {
  return await axiosAuthInstance.get(
    `${ReceptionAPIUrl}/anomalies/sortie/${sortieId}`,
  );
};

export const regulariserReception = async (
  receptionId: string,
  data: ManageRegularisationInterface,
) => {
  return await axiosAuthInstance.post(
    `${ReceptionAPIUrl}/${receptionId}/regularisation`,
    data,
  );
};
