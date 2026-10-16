import axiosAuthInstance from "./Config";
import { BASE_URL } from "@/config/appConfig";

const NotificationAPIUrl = `${BASE_URL}/notification`;

export const getMesNotifications = async (limit = 20) => {
  return await axiosAuthInstance.get(`${NotificationAPIUrl}/mine`, {
    params: { limit },
  });
};

export const getNombreNotificationsNonLues = async () => {
  return await axiosAuthInstance.get(
    `${NotificationAPIUrl}/mine/non-lus/count`,
  );
};

export const marquerNotificationLue = async (id: string) => {
  return await axiosAuthInstance.patch(`${NotificationAPIUrl}/${id}/lu`);
};

export const marquerToutesNotificationsLues = async () => {
  return await axiosAuthInstance.patch(`${NotificationAPIUrl}/tout-lu`);
};
