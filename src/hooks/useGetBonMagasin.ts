import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getBonMagasin } from "@/api/bonmagasins";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetBonMagasin = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.BONS_MAGASIN, id],
        queryFn: () => getBonMagasin(id as string),
        enabled: !!id
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