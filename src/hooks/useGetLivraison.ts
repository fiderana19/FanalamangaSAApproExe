import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getLivraison } from "@/api/livraisons";
import { useQuery } from "@tanstack/react-query";

export const useGetLivraison = (id?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.LIVRAISON, "detail", id],
        queryFn: () => getLivraison(id as string),
        enabled: !!id,
        retry: false,
    })

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data ?? null
    }
}
