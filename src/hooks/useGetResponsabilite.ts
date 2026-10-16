import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getResponsabilite } from "@/api/responsabilites";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetResponsabilite = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.RESPONSABILITES, id],
        queryFn: () => getResponsabilite(id as string),
        enabled: !!id,
        staleTime: Infinity
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de la responsabilité !"
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