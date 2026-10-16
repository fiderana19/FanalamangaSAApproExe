import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getMesApprovisionnements } from "@/api/approvisionnements";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetMesApprovisionnements = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.APPROVISIONNEMENT, "mine"],
        queryFn: () => getMesApprovisionnements(),
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
