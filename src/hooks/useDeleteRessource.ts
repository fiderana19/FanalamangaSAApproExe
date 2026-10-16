import { deleteRessource } from "@/api/ressources";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteRessource = ({action}: {action?: () => void} = {}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: string) => deleteRessource(id),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.ressourceImpact);
            if(action) {
                action();
            }
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Ressource supprimée !"
            })
        },
        onError: (error: AxiosError) => {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: error?.message
            })
        }
    })

    return mutation;
}