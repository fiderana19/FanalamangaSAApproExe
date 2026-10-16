import { createBonMagasin } from "@/api/bonmagasins";
import { invalidateKeys, QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ManageBonMagasinInterface } from "@/interfaces/BonMagasin";

export const useCreerBonMagasin = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: ManageBonMagasinInterface) =>
            createBonMagasin(data),
        onSuccess: () => {
            invalidateKeys(queryClient, QUERY_INVALIDATION_GROUPS.bonMagasin);
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Bon de magasin établi !"
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