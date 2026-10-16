import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getApprovisionnements } from "@/api/approvisionnements";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetApprovisionnements = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.APPROVISIONNEMENT, "all"],
        queryFn: () => getApprovisionnements(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération des approvisionnements !"
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
