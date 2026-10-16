import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getLivraisonsParSortie } from "@/api/livraisons";
import { useQuery } from "@tanstack/react-query";

export const useGetLivraisonsParSortie = (sortieId?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.LIVRAISON, "sortie", sortieId],
        queryFn: () => getLivraisonsParSortie(sortieId as string),
        enabled: !!sortieId,
        retry: false,
    })

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data ?? []
    }
}
