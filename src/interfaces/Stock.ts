export interface StockOperationItemInterface {
  reference: string;
  valeur: number;
}

export type StockOperationStatusType = "success" | "failed";

export interface StockOperationDetailInterface {
  reference: string;
  status: StockOperationStatusType;
  nouveauStock?: number;
  reason?: string;
}

export interface StockOperationResultInterface {
  message: string;
  success: number;
  failed: number;
  details: StockOperationDetailInterface[];
}
