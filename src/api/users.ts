import { LoginInterface, ManageUserInterface, CreateUserInterface, ForgotPasswordInterface, ChangeMyPasswordInterface } from "@/interfaces/User";
import axiosAuthInstance, { axiosInstance } from "./Config";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { HttpStatus } from "@/constants/Http_status";
import { AxiosError } from "axios";
import { BASE_URL } from "@/config/appConfig";

const UserAPIUrl = `${BASE_URL}/auth`;

export const userLogin = async (data: LoginInterface) => {
  try {
    return await axiosInstance.post(`${UserAPIUrl}/login`, data);
  } catch (error) {
    const err = error as AxiosError;
    if(err?.response?.status == HttpStatus.BAD_REQUEST || err?.response?.status == HttpStatus.UNAUTHORIZED) {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: (err?.response?.data as { message?: string })?.message ?? "Erreur lors de la connexion !"
      })
    } else if (err.code == "ERR_NETWORK") {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Erreur lors de la connexion au serveur !"
      })
    }
  }
}

export const forgotPassword = async (data: ForgotPasswordInterface) => {
  try {
    return await axiosInstance.post(`${UserAPIUrl}/forgot-password`, data);
  } catch (error) {
    const err = error as AxiosError;
    if (
      err?.response?.status == HttpStatus.BAD_REQUEST ||
      err?.response?.status == HttpStatus.NOT_FOUND
    ) {
      showToast({
        type: TOAST_TYPE.ERROR,
        message:
          (err?.response?.data as { message?: string })?.message ??
          "Erreur lors de la réinitialisation du mot de passe !"
      })
    } else if (err.code == "ERR_NETWORK") {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Erreur lors de la connexion au serveur !"
      })
    }
  }
}

export const getProfile = async () => {
  return await axiosAuthInstance.get(`${UserAPIUrl}/profile`);
}

export const changeMyPassword = async (data: ChangeMyPasswordInterface) => {
  try {
    return await axiosAuthInstance.patch(`${UserAPIUrl}/profile/password`, {
      ancienMotDePasse: data.ancienMotDePasse,
      nouveauMotDePasse: data.nouveauMotDePasse,
    });
  } catch (error) {
    const err = error as AxiosError;
    if (
      err?.response?.status == HttpStatus.BAD_REQUEST ||
      err?.response?.status == HttpStatus.UNAUTHORIZED
    ) {
      showToast({
        type: TOAST_TYPE.ERROR,
        message:
          (err?.response?.data as { message?: string })?.message ??
          "Erreur lors du changement de mot de passe !"
      })
    } else if (err.code == "ERR_NETWORK") {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Erreur lors de la connexion au serveur !"
      })
    }
  }
}

export const createUser = async (data: CreateUserInterface) => {
  return await axiosAuthInstance.post(`${UserAPIUrl}`, data);
}

export const getUsers = async () => {
  return await axiosAuthInstance.get(`${UserAPIUrl}/users`);
}

export const getUser = async (id: string) => {
  return await axiosAuthInstance.get(`${UserAPIUrl}/${id}`);
}

export const updateUser = async (id: string, data: ManageUserInterface) => {
  return await axiosAuthInstance.patch(`${UserAPIUrl}/${id}`, data);
}

export const deleteUser = async (id: string) => {
  return await axiosAuthInstance.delete(`${UserAPIUrl}/${id}`);
}

export const activateUser = async (id: string) => {
  return await axiosAuthInstance.patch(`${UserAPIUrl}/activate/${id}`);
}

export const deactivateUser = async (id: string) => {
  return await axiosAuthInstance.patch(`${UserAPIUrl}/deactivate/${id}`);
}