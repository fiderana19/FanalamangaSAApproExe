import { controlerDemande } from "@/api/demandes";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ControlerDemandeInterface } from "@/interfaces/Demande";

export const useControlerDemande = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: ControlerDemandeInterface }) =>
            controlerDemande(id, data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.demande);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Demande contrôlée !"
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