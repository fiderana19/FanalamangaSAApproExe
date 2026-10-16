import axiosAuthInstance, { axiosMutlipartFormDataInstance } from "./Config";
import { BASE_URL } from "@/config/appConfig";

const BackupAPIUrl = `${BASE_URL}/backup`;

export const downloadBackup = async () => {
  return await axiosAuthInstance.get(`${BackupAPIUrl}/sauvegarde`, {
    responseType: "blob",
  });
};

export const restoreBackup = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  return await axiosMutlipartFormDataInstance.post(
    `${BackupAPIUrl}/restauration`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
