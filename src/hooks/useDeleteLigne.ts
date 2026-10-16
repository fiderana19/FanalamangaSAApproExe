import { deleteLigneDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteLigne = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({demandeId, ligneId}: {demandeId: string, ligneId: string}) => deleteLigneDemande(demandeId, ligneId),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Ligne supprimée !"
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