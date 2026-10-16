import { createDemandeAchat } from "@/api/demandeAchats";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageDemandeAchatInterface } from "@/interfaces/DemandeAchat";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateDemandeAchat = ({
  action,
}: { action?: (data?: any) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ManageDemandeAchatInterface) => createDemandeAchat(data),
    onSuccess: (response) => {
      invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.achat);
      if (action) {
        action(response?.data);
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Demande d'achat créée avec succès !",
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
