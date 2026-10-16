import { QueryCacheKey } from "@/api/QueryCacheKey";
import { marquerToutesNotificationsLues } from "@/api/notifications";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMarquerToutesLues = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => marquerToutesNotificationsLues(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryCacheKey.NOTIFICATIONS],
            });
        },
        onError: (error: AxiosError) => {
            showToast({ type: TOAST_TYPE.ERROR, message: error?.message });
        },
    });

    return mutation;
};
