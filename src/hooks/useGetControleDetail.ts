import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getControleDetail } from "@/api/demandes";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetControleDetail = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDES, "controle", "detail", id],
        queryFn: () => getControleDetail(id as string),
        enabled: !!id,
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération du détail du contrôle !"
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