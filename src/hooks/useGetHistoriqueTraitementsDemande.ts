import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getHistoriqueTraitementsDemande } from "@/api/demandes";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetHistoriqueTraitementsDemande = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDES, "traitement", "historique"],
        queryFn: () => getHistoriqueTraitementsDemande(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'historique des demandes !"
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