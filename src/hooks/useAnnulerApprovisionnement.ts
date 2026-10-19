import { annulerApprovisionnement } from "@/api/approvisionnements";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { AnnulerApprovisionnementInterface } from "@/interfaces/Approvisionnement";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useAnnulerApprovisionnement = ({
  action,
}: { action?: (data?: unknown) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AnnulerApprovisionnementInterface;
    }) => annulerApprovisionnement(id, data),
    onSuccess: (response) => {
      invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.sortieStatut);
      if (action) action(response?.data);
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Approvisionnement annulé avec succès !",
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
};
