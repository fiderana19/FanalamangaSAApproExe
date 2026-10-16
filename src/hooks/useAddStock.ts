import { addStock } from "@/api/stock";
import { TOAST_TYPE } from "@/constants/ToastType";
import {
  StockOperationItemInterface,
  StockOperationResultInterface,
} from "@/interfaces/Stock";
import { showToast } from "@/utils/Toast";
import { useMutation } from "@tanstack/react-query";

const resumeEchecs = (result: StockOperationResultInterface) =>
  result.details
    .filter((detail) => detail.status === "failed")
    .map(
      (detail) =>
        `${detail.reference}${detail.reason ? ` (${detail.reason})` : ""}`,
    )
    .join(", ");

export const useAddStock = () => {
  const mutation = useMutation({
    mutationFn: (items: StockOperationItemInterface[]) => addStock(items),
    onSuccess: (result: StockOperationResultInterface) => {
      if (result.failed > 0) {
        showToast({
          type: TOAST_TYPE.WARNING,
          message: `Ajout partiel : ${result.success} réussi(s), ${result.failed} échec(s) — ${resumeEchecs(result)}`,
        });
        return;
      }
      showToast({
        type: TOAST_TYPE.SUCCESS,
        message: "Stock réapprovisionné avec succès !",
      });
    },
    onError: (error: Error) => {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: error?.message,
      });
    },
  });

  return mutation;
};
