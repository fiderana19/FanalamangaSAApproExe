import axiosAuthInstance from "./Config";
import { ManageReceptionInterface } from "@/interfaces/Reception";
import { BASE_URL } from "@/config/appConfig";

const ReceptionAPIUrl = `${BASE_URL}/reception`;

export const createReception = async (data: ManageReceptionInterface) => {
  return await axiosAuthInstance.post(`${ReceptionAPIUrl}`, data);
};
