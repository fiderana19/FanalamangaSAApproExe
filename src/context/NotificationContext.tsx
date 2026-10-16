import { QueryCacheKey } from "@/api/QueryCacheKey";
import { invalidateKeys } from "@/api/invalidation";
import {
    ALL_INVALIDATION_KEYS,
    NOTIFICATION_INVALIDATION,
} from "@/constants/NotificationInvalidation";
import { useAuth } from "@/context/AuthContext";
import { useGetMesNotifications } from "@/hooks/useGetMesNotifications";
import { useMarquerNotificationLue } from "@/hooks/useMarquerNotificationLue";
import { useMarquerToutesLues } from "@/hooks/useMarquerToutesLues";
import { NotificationInterface } from "@/interfaces/Notification";
import { useQueryClient } from "@tanstack/react-query";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { BASE_URL, WS_URL_OVERRIDE } from "@/config/appConfig";
import { io } from "socket.io-client";

const WS_URL = (() => {
    if (WS_URL_OVERRIDE) {
        return WS_URL_OVERRIDE;
    }
    const origin = new URL(BASE_URL, window.location.origin).origin;
    return `${origin}/notifications`;
})();

interface NotificationContextProps {
    notifications: NotificationInterface[];
    nonLus: number;
    isLoading: boolean;
    marquerLue: (id: string) => void;
    marquerToutesLues: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
    undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const estAuthentifie = !!token;
    const dejaConnecte = useRef(false);

    const { data: notifications, isLoading } = useGetMesNotifications({
        enabled: estAuthentifie,
    });
    const { mutate: marquerLue } = useMarquerNotificationLue();
    const { mutate: marquerToutesLues } = useMarquerToutesLues();

    const nonLus = useMemo(
        () => notifications.filter((notification) => !notification.estLu).length,
        [notifications],
    );

    useEffect(() => {
        if (!token) {
            return;
        }
        dejaConnecte.current = false;

        const socket = io(WS_URL, { auth: { token } });

        const rafraichirNotifications = () =>
            queryClient.invalidateQueries({
                queryKey: [QueryCacheKey.NOTIFICATIONS],
            });

        const resynchroniser = () => {
            rafraichirNotifications();
            if (dejaConnecte.current) {
                invalidateKeys(queryClient, ALL_INVALIDATION_KEYS);
            }
            dejaConnecte.current = true;
        };

        const surNouvelleNotification = (
            notification: NotificationInterface,
        ) => {
            rafraichirNotifications();
            const cles =
                NOTIFICATION_INVALIDATION[notification?.typeNotification] ?? [];
            if (cles.length > 0) {
                invalidateKeys(queryClient, cles);
            }
        };

        socket.on("connect", resynchroniser);
        socket.on("notification:nouvelle", surNouvelleNotification);
        socket.on("notification:compteur", rafraichirNotifications);

        return () => {
            socket.off("connect", resynchroniser);
            socket.off("notification:nouvelle", surNouvelleNotification);
            socket.off("notification:compteur", rafraichirNotifications);
            socket.disconnect();
        };
    }, [token, queryClient]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                nonLus,
                isLoading,
                marquerLue,
                marquerToutesLues,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotifications must be inside of a NotificationProvider",
        );
    }
    return context;
}
