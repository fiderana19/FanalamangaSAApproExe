import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getDemandeAchat } from "@/api/demandeAchats";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetDemandeAchat = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDE_ACHAT, id],
        queryFn: () => getDemandeAchat(id as string),
        enabled: !!id,
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de la demande d'achat !"
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
