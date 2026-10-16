import { STOCK_BASE_URL, STOCK_API_KEY } from "@/config/appConfig";
import {
  StockOperationItemInterface,
  StockOperationResultInterface,
} from "@/interfaces/Stock";


const STOCK_RESOURCES_URL = `${STOCK_BASE_URL.replace(/\/$/, "")}/stock-app/v1.0.0/resources`;

const stockFetch = async <T = any>(
  path: string,
  body: unknown,
  method: "POST" | "PATCH" = "POST",
): Promise<T> => {
  const url = `${STOCK_RESOURCES_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "x-api-key": STOCK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  const rawText = await response.text();

  if (response.status === 401) {
    throw new Error("Clé d'API refusée par le service de stock externe");
  }
  if (!response.ok) {
    throw new Error(
      `Le service de stock externe a répondu avec une erreur (${response.status} ${response.statusText})`,
    );
  }

  let data: unknown = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = rawText;
  }

  return data as T;
};

export const getStockByReferences = async (references: string[]) => {
  return await stockFetch("/by-references", { references });
};

export const withdrawStock = async (
  items: StockOperationItemInterface[],
): Promise<StockOperationResultInterface> => {
  return await stockFetch<StockOperationResultInterface>(
    "/stock/withdrawals",
    items,
    "PATCH",
  );
};

export const addStock = async (
  items: StockOperationItemInterface[],
): Promise<StockOperationResultInterface> => {
  return await stockFetch<StockOperationResultInterface>(
    "/stock/additions",
    items,
    "PATCH",
  );
};
