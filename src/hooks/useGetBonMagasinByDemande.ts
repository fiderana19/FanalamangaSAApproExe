import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getBonMagasinByDemande } from "@/api/bonmagasins";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetBonMagasinByDemande = (demandeId?: string, enabled?: boolean) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.BONS_MAGASIN, "demande", demandeId],
        queryFn: () => getBonMagasinByDemande(demandeId as string),
        enabled: !!demandeId && !!enabled,
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération du bon de magasin !"
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