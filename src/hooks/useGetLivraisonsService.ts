import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getLivraisonsService } from "@/api/livraisons";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetLivraisonsService = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.LIVRAISON, "service"],
        queryFn: () => getLivraisonsService(),
    })

    useEffect(() => {
        if (isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération des livraisons du service !"
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
