import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getDemandeAchatByAppro } from "@/api/demandeAchats";
import { useQuery } from "@tanstack/react-query";

export const useGetDemandeAchatByAppro = (approvisionnementId?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.DEMANDE_ACHAT, "appro", approvisionnementId],
        queryFn: () => getDemandeAchatByAppro(approvisionnementId as string),
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
