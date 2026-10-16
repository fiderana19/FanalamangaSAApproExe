import { updateDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageDemandeInterface } from "@/interfaces/Demande";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const usePatchDemande = ({action}: {action?: () => void} = {}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({id, data}: {id: string, data: ManageDemandeInterface}) => updateDemande(id, data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            if(action) {
                action();
            }
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Demande modifiée avec succès !"
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