import { importRessources } from "@/api/ressources";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

const getErrorMessage = (error: AxiosError) => {
  const data = error.response?.data as { message?: string; statusCode?: number } | undefined;
  return data?.message ?? error?.message ?? "Une erreur est survenue";
};

export const useImportRessources = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<AxiosResponse, AxiosError, File>({
        mutationFn: (file: File) => importRessources(file),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.ressource);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Fichier importé avec succès !"
            })
        },
        onError: (error: AxiosError) => {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: getErrorMessage(error)
            })
        }
    })

    return mutation;
}