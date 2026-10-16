import { createDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageDemandeInterface } from "@/interfaces/Demande";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateDemande = ({action}: {action?: (data?: any) => void} = {}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: ManageDemandeInterface) => createDemande(data),
        onSuccess: (response) => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            if(action) {
                action(response?.data);
            }
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Demande créée avec succès !"
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