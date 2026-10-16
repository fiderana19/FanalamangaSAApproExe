import { QueryCacheKey } from "@/api/QueryCacheKey";
import { marquerNotificationLue } from "@/api/notifications";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMarquerNotificationLue = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => marquerNotificationLue(id),
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
