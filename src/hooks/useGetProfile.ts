import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getProfile } from "@/api/users";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetProfile = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.PROFILE],
        queryFn: () => getProfile(),
        staleTime: Infinity
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors du chargement du profil !"
            })
        }
    }, [error])

    return {
        isLoading,
        refetch,
        data: data?.data
    }
}