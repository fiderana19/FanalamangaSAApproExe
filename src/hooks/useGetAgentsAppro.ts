import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getAgentsAppro } from "@/api/users";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetAgentsAppro = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.USERS, "AGENTS_APPRO"],
        queryFn: () => getAgentsAppro(),
        staleTime: Infinity
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération des agents d'approvisionnement !"
            })
        }
    }, [error, isError])

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data
    }
}
