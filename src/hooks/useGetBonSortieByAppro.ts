import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getBonSortieByAppro } from "@/api/bonSorties";
import { useQuery } from "@tanstack/react-query";

export const useGetBonSortieByAppro = (approvisionnementId?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.BONS_SORTIE, "appro", approvisionnementId],
        queryFn: () => getBonSortieByAppro(approvisionnementId as string),
        enabled: !!approvisionnementId,
        retry: false,
    })

    return {
        isLoading,
        refetch,
        isError,
        data: data?.data ?? null
    }
}