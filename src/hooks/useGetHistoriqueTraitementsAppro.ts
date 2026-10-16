import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getHistoriqueTraitementsAppro } from "@/api/approvisionnements";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetHistoriqueTraitementsAppro = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.APPROVISIONNEMENT, "traitement", "historique"],
        queryFn: () => getHistoriqueTraitementsAppro(),
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'historique des approvisionnements !"
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