import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getApprovisionnementsService } from "@/api/approvisionnements";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetApprovisionnementsService = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.APPROVISIONNEMENT, "service"],
        queryFn: () => getApprovisionnementsService(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération des approvisionnements du service !"
            })
        }
    }, [error])

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data
    }
}
