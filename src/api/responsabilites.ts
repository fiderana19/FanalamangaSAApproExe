import axiosAuthInstance from "./Config";
import { ManageResponsabiliteInterface } from "@/interfaces/Responsabilite";
import { BASE_URL } from "@/config/appConfig";

const ResponsabiliteAPIUrl = `${BASE_URL}/responsabilite`;

export const getResponsabilites = async () => {
  return await axiosAuthInstance.get(`${ResponsabiliteAPIUrl}`);
}

export const getResponsabilite = async (id: string) => {
  return await axiosAuthInstance.get(`${ResponsabiliteAPIUrl}/get/${id}`);
}

export const createResponsabilite = async (data: ManageResponsabiliteInterface) => {
  return await axiosAuthInstance.post(`${ResponsabiliteAPIUrl}`, data);
}

export const updateResponsabilite = async (id: string, data: ManageResponsabiliteInterface) => {
  return await axiosAuthInstance.patch(`${ResponsabiliteAPIUrl}/${id}`, data);
}

export const deleteResponsabilite = async (id: string) => {
  return await axiosAuthInstance.delete(`${ResponsabiliteAPIUrl}/${id}`);
}