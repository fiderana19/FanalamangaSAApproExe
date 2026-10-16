import { updateResponsabilite } from "@/api/responsabilites";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { ManageResponsabiliteInterface } from "@/interfaces/Responsabilite";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const usePatchResponsabilite = ({action}: {action?: () => void} = {}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({id, data}: {id: string, data: ManageResponsabiliteInterface}) => updateResponsabilite(id, data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.responsabilite);
            if(action) {
                action();
            }
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Responsabilité modifiée avec succès !"
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