import axiosAuthInstance from "./Config";
import { BASE_URL } from "@/config/appConfig";
import {
  ControlerDemandeInterface,
  ManageDemandeInterface,
  ManageLigneDemandeInterface,
  TraiterDemandeInterface,
} from "@/interfaces/Demande";

const DemandeAPIUrl = `${BASE_URL}/demande`;

export const getMesDemandes = async () => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/mine`);
}

export const getDemandesDuService = async () => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/service`);
}

export const getDemande = async (id: string) => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/${id}`);
}

export const getTraitementsDemande = async (id: string) => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/traitement/${id}`);
}

export const getHistoriqueTraitementsDemande = async () => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/traitement/historique`);
}

export const createDemande = async (data: ManageDemandeInterface) => {
  return await axiosAuthInstance.post(`${DemandeAPIUrl}`, data);
}

export const updateDemande = async (id: string, data: ManageDemandeInterface) => {
  return await axiosAuthInstance.patch(`${DemandeAPIUrl}/${id}`, data);
}

export const deleteDemande = async (id: string) => {
  return await axiosAuthInstance.delete(`${DemandeAPIUrl}/${id}`);
}

export const createLigneDemande = async (demandeId: string, data: ManageLigneDemandeInterface) => {
  return await axiosAuthInstance.post(`${DemandeAPIUrl}/${demandeId}/ligne`, data);
}

export const updateLigneDemande = async (demandeId: string, ligneId: string, data: ManageLigneDemandeInterface) => {
  return await axiosAuthInstance.patch(`${DemandeAPIUrl}/${demandeId}/ligne/${ligneId}`, data);
}

export const deleteLigneDemande = async (demandeId: string, ligneId: string) => {
  return await axiosAuthInstance.delete(`${DemandeAPIUrl}/${demandeId}/ligne/${ligneId}`);
}

export const validerDemande = async (id: string, data: TraiterDemandeInterface) => {
  return await axiosAuthInstance.patch(`${DemandeAPIUrl}/valider/${id}`, data);
}

export const refuserDemande = async (id: string, data: TraiterDemandeInterface) => {
  return await axiosAuthInstance.patch(`${DemandeAPIUrl}/refuser/${id}`, data);
}

export const getDemandesAControler = async () => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/controle`);
}

export const controlerDemande = async (id: string, data: ControlerDemandeInterface) => {
  return await axiosAuthInstance.patch(`${DemandeAPIUrl}/controle/${id}`, data);
}

export const getHistoriqueControles = async () => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/controle/historique`);
}

export const getControleDetail = async (id: string) => {
  return await axiosAuthInstance.get(`${DemandeAPIUrl}/controle/detail/${id}`);
}
