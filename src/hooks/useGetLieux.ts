import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getServiceLieux } from "@/api/services";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetLieux = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.LIEUX],
        queryFn: () => getServiceLieux(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération des lieux !"
            })
        }
    }, [error])

    const lieux = Array.from(new Set<string>(data?.data ?? [])).sort(
        (a, b) => a.localeCompare(b),
    );

    return {
        isLoading,
        refetch,
        isError,
        data: lieux
    }
}