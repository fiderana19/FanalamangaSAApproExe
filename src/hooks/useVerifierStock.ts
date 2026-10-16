import { getStockByReferences } from "@/api/stock";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { useMutation } from "@tanstack/react-query";

export const useVerifierStock = () => {
    const mutation = useMutation({
        mutationFn: (references: string[]) => getStockByReferences(references),
        onError: (error: Error) => {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: error?.message
            })
        }
    })

    return mutation
}
