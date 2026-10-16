import { updateLigneDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageLigneDemandeInterface } from "@/interfaces/Demande";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const usePatchLigne = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({demandeId, ligneId, data}: {demandeId: string, ligneId: string, data: ManageLigneDemandeInterface}) => updateLigneDemande(demandeId, ligneId, data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Ligne modifiée avec succès !"
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