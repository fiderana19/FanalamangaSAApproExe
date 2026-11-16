import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getAnomaliesParSortie } from "@/api/receptions";
import { AnomaliesSortieInterface } from "@/interfaces/Reception";
import { useQuery } from "@tanstack/react-query";

export const useGetAnomaliesParSortie = (sortieId?: string) => {
  const { data, isLoading, isError, refetch } =
    useQuery<AnomaliesSortieInterface>({
      queryKey: [QueryCacheKey.RECEPTION, "anomalies", sortieId],
      queryFn: () =>
        getAnomaliesParSortie(sortieId as string).then(
          (response) => response.data,
        ),
      enabled: !!sortieId,
      retry: false,
    });

  return {
    isLoading,
    refetch,
    isError,
    data: data ?? { anomalies: [], recevables: [] },
  };
};
