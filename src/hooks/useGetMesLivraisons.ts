import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getMesLivraisons } from "@/api/livraisons";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetMesLivraisons = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.LIVRAISON, "mine"],
        queryFn: () => getMesLivraisons(),
    })

    useEffect(() => {
        if (isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de vos livraisons !"
            })
        }
    }, [error])

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data ?? []
    }
}
