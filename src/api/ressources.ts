import axiosAuthInstance, { axiosMutlipartFormDataInstance } from "./Config";
import { ManageRessourceInterface } from "@/interfaces/Ressource";
import { BASE_URL } from "@/config/appConfig";

const RessourceAPIUrl = `${BASE_URL}/ressource`;

export const getRessources = async () => {
  return await axiosAuthInstance.get(`${RessourceAPIUrl}`);
}

export const getRessource = async (id: string) => {
  return await axiosAuthInstance.get(`${RessourceAPIUrl}/${id}`);
}

export const createRessource = async (data: ManageRessourceInterface) => {
  return await axiosAuthInstance.post(`${RessourceAPIUrl}`, data);
}

export const updateRessource = async (id: string, data: ManageRessourceInterface) => {
  return await axiosAuthInstance.patch(`${RessourceAPIUrl}/${id}`, data);
}

export const deleteRessource = async (id: string) => {
  return await axiosAuthInstance.delete(`${RessourceAPIUrl}/${id}`);
}

export const importRessources = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  return await axiosMutlipartFormDataInstance.post(
    `${RessourceAPIUrl}/import`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}