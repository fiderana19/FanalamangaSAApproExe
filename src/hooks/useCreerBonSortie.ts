import { createBonSortie } from "@/api/bonSorties";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageBonSortieInterface } from "@/interfaces/BonSortie";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreerBonSortie = ({
  action,
}: { action?: (data?: any) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ManageBonSortieInterface) => createBonSortie(data),
    onSuccess: (response) => {
      invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.sortie);
      if (action) {
        action(response?.data);
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Bon de sortie de magasin établi !",
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