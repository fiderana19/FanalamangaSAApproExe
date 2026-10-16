import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getHistoriqueStatutsDemandeAchat } from "@/api/demandeAchats";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetHistoriqueStatutsDemandeAchat = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDE_ACHAT, "statut", "historique"],
        queryFn: () => getHistoriqueStatutsDemandeAchat(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'historique des achats !"
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