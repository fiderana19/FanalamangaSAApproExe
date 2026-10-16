import { changerStatutBonSortie } from "@/api/bonSorties";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { SortieStatutType } from "@/interfaces/BonSortie";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useChangerStatutBonSortie = ({
  action,
}: { action?: (data?: unknown) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: SortieStatutType }) =>
      changerStatutBonSortie(id, statut),
    onSuccess: (response) => {
      invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.sortieStatut);
      if (action) {
        action(response?.data);
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Bon de sortie mis à jour avec succès !",
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
