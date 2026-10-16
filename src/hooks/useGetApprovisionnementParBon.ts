import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getApprovisionnementParBon } from "@/api/approvisionnements";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetApprovisionnementParBon = (bonMagasinId?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.APPROVISIONNEMENT, "bon", bonMagasinId],
        queryFn: () => getApprovisionnementParBon(bonMagasinId as string),
        enabled: !!bonMagasinId,
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'approvisionnement !"
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
