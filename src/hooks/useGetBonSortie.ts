import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getBonSortie } from "@/api/bonSorties";
import { useQuery } from "@tanstack/react-query";

export const useGetBonSortie = (id?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.BONS_SORTIE, "detail", id],
        queryFn: () => getBonSortie(id as string),
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