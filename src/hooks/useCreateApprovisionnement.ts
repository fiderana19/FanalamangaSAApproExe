import { createApprovisionnement } from "@/api/approvisionnements";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ManageApprovisionnementInterface } from "@/interfaces/Approvisionnement";

export const useCreateApprovisionnement = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: ManageApprovisionnementInterface) =>
            createApprovisionnement(data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.approFromBon);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Approvisionnement créé !"
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
