import { QueryCacheKey } from "@/api/QueryCacheKey";
import { getMesNotifications } from "@/api/notifications";
import { TOAST_TYPE } from "@/constants/ToastType";
import { HttpStatus } from "@/constants/Http_status";
import { NotificationInterface } from "@/interfaces/Notification";
import { showToast } from "@/utils/Toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

export const useGetMesNotifications = ({
    enabled = true,
    limit = 20,
}: { enabled?: boolean; limit?: number } = {}) => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.NOTIFICATIONS],
        queryFn: () => getMesNotifications(limit),
        enabled,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!enabled || !isError) {
            return;
        }
        const status = (error as AxiosError)?.response?.status;
        if (
            status === HttpStatus.UNAUTHORIZED ||
            status === HttpStatus.FORBIDDEN
        ) {
            return;
        }
        showToast({
            type: TOAST_TYPE.ERROR,
            message: "Erreur lors de la récupération des notifications !",
        });
    }, [error, isError, enabled]);

    return {
        isLoading,
        refetch,
        data: (data?.data ?? []) as NotificationInterface[],
    };
};
