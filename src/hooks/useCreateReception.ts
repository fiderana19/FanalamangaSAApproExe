import { createReception } from "@/api/receptions";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageReceptionInterface } from "@/interfaces/Reception";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateReception = ({
  action,
}: { action?: (data?: unknown) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ManageReceptionInterface) => createReception(data),
    onSuccess: (response) => {
      invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.reception);
      if (action) {
        action(response?.data);
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Réception enregistrée avec succès !",
      });
    },
    onError: (error: AxiosError) => {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: error?.message,
      });
    },
  });

  return mutation;
}
