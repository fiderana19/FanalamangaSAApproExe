import axiosAuthInstance from "./Config";
import { ManageServiceInterface } from "@/interfaces/Service";
import { BASE_URL } from "@/config/appConfig";

const ServiceAPIUrl = `${BASE_URL}/service`;

export const getServices = async () => {
  return await axiosAuthInstance.get(`${ServiceAPIUrl}`);
}

export const getService = async (id: string) => {
  return await axiosAuthInstance.get(`${ServiceAPIUrl}/${id}`);
}

export const getServiceLieux = async () => {
  return await axiosAuthInstance.get(`${ServiceAPIUrl}/lieux`);
}

export const createService = async (data: ManageServiceInterface) => {
  return await axiosAuthInstance.post(`${ServiceAPIUrl}`, data);
}

export const updateService = async (id: string, data: ManageServiceInterface) => {
  return await axiosAuthInstance.patch(`${ServiceAPIUrl}/${id}`, data);
}

export const deleteService = async (id: string) => {
  return await axiosAuthInstance.delete(`${ServiceAPIUrl}/${id}`);
}