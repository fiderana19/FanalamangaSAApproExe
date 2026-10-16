import { refuserDemande, validerDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TraiterDemandeInterface } from "@/interfaces/Demande";

export type TraiterDemandeAction = "valider" | "refuser";

const TOASTS: Record<TraiterDemandeAction, string> = {
    valider: "Demande validée !",
    refuser: "Demande refusée !",
}

export const useTraiterDemande = ({ action }: { action: TraiterDemandeAction }) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: TraiterDemandeInterface }) =>
            action === "valider" ? validerDemande(id, data) : refuserDemande(id, data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: TOASTS[action]
            })
        },
        onError: (error: AxiosError) => {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: error?.message
            })
        }
    })

    return mutation
}
