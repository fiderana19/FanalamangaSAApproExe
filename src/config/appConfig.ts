export interface AppConfigInterface {
    baseUrl?: string;
    stockUrl?: string;
    stockApiKey?: string;
    wsUrl?: string;
}

declare global {
    interface Window {
        appConfig?: AppConfigInterface;
        electronAPI?: {
            retryBackend: () => void;
            onSplashStatus: (callback: (status: { state: string; message?: string; manual?: boolean }) => void) => () => void;
        };
    }
}

const runtimeConfig: AppConfigInterface =
    typeof window !== "undefined" && window.appConfig ? window.appConfig : {};

export const BASE_URL: string =
    runtimeConfig.baseUrl || (import.meta.env.VITE_BASE_URL as string);

export const STOCK_BASE_URL: string =
    runtimeConfig.stockUrl || (import.meta.env.VITE_STOCK_URL as string);

export const STOCK_API_KEY: string =
    runtimeConfig.stockApiKey || (import.meta.env.VITE_STOCK_X_API_KEY as string);

export const WS_URL_OVERRIDE: string =
    runtimeConfig.wsUrl || (import.meta.env.VITE_WS_URL as string) || "";
