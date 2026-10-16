import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getUser } from "@/api/users";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useGetUser = (id?: string) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.USERS, id],
        queryFn: () => getUser(id as string),
        enabled: !!id,
        staleTime: Infinity
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récupération de l'utilisateur !"
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