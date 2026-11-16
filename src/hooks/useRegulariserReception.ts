import { regulariserReception } from "@/api/receptions";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageRegularisationInterface } from "@/interfaces/Reception";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface RegulariserReceptionPayload {
  receptionId: string;
  data: ManageRegularisationInterface;
}

export const useRegulariserReception = ({
  action,
}: { action?: (data?: unknown) => void } = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ receptionId, data }: RegulariserReceptionPayload) =>
      regulariserReception(receptionId, data),
    onSuccess: async (response) => {
      await invalidateKeys(
        queryClient,
        QUERY_INVALIDATION_GROUPS.regularisation,
      );
      if (action) {
        action(response?.data);
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Livraison régularisée avec succès !",
      });
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const message = error?.response?.data?.message;
      showToast({
        type: TOAST_TYPE.ERROR,
        message: Array.isArray(message)
          ? message.join(" ")
          : message ?? error?.message,
      });
    },
  });

  return mutation;
};
