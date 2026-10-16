import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getTraitementsDemande } from "@/api/demandes";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetTraitementsDemande = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDES, "traitements", id],
        queryFn: () => getTraitementsDemande(id as string),
        enabled: !!id,
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'historique de la demande !"
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
