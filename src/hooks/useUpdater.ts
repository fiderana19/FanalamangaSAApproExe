import { useCallback, useEffect, useState } from "react";

export type UpdateStatus =
    | "idle"
    | "checking"
    | "available"
    | "not-available"
    | "downloading"
    | "downloaded"
    | "installing"
    | "error";

export interface UpdateInfoInterface {
    version?: string;
    releaseName?: string;
    releaseNotes?: string;
    releaseDate?: string;
}

export interface UpdateProgressInterface {
    percent: number;
    transferred: number;
    total: number;
    bytesPerSecond: number;
}

export interface UseUpdaterInterface {
    status: UpdateStatus;
    info: UpdateInfoInterface;
    progress: UpdateProgressInterface | null;
    error: string | null;
    download: () => Promise<void>;
    retry: () => Promise<void>;
    install: () => Promise<void>;
}

export const useUpdater = (): UseUpdaterInterface => {
    const [status, setStatus] = useState<UpdateStatus>("idle");
    const [info, setInfo] = useState<UpdateInfoInterface>({});
    const [progress, setProgress] = useState<UpdateProgressInterface | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const api = window.electronAPI;
        if (!api?.onUpdateEvent) return;

        const unsubscribe = api.onUpdateEvent((event) => {
            if (!event) return;

            switch (event.state) {
                case "checking":
                    setStatus("checking");
                    setError(null);
                    break;
                case "available":
                    setInfo({
                        version: event.version,
                        releaseName: event.releaseName,
                        releaseNotes: event.releaseNotes,
                        releaseDate: event.releaseDate,
                    });
                    setStatus("available");
                    setError(null);
                    break;
                case "not-available":
                    setStatus("not-available");
                    break;
                case "progress":
                    setProgress({
                        percent: event.percent ?? 0,
                        transferred: event.transferred ?? 0,
                        total: event.total ?? 0,
                        bytesPerSecond: event.bytesPerSecond ?? 0,
                    });
                    setStatus("downloading");
                    break;
                case "downloaded":
                    setProgress((current) =>
                        current
                            ? { ...current, percent: 100, transferred: current.total }
                            : null,
                    );
                    setStatus("downloaded");
                    break;
                case "error":
                    setError(event.message || "Une erreur est survenue.");
                    setStatus("error");
                    break;
                default:
                    break;
            }
        });

        return unsubscribe;
    }, []);

    const download = useCallback(async () => {
        setError(null);
        setProgress(null);
        setStatus("downloading");
        try {
            await window.electronAPI?.downloadUpdate();
        } catch (err) {
            setError((err as Error)?.message || "Impossible de démarrer le téléchargement.");
            setStatus("error");
        }
    }, []);

    const retry = useCallback(async () => {
        await download();
    }, [download]);

    const install = useCallback(async () => {
        setStatus("installing");
        try {
            await window.electronAPI?.installUpdate();
        } catch (err) {
            setError((err as Error)?.message || "Impossible de lancer l'installation.");
            setStatus("error");
        }
    }, []);

    return { status, info, progress, error, download, retry, install };
};
