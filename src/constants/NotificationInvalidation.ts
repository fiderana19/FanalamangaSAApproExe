import { QueryCacheKey } from "@/api/QueryCacheKey";
import { QUERY_INVALIDATION_GROUPS } from "@/api/invalidation";
import { NOTIFICATION_TYPE } from "@/constants/NotificationType";

export const NOTIFICATION_INVALIDATION: Record<string, QueryCacheKey[]> = {
    [NOTIFICATION_TYPE.VALIDATION]: QUERY_INVALIDATION_GROUPS.demande,
    [NOTIFICATION_TYPE.REFUS]: QUERY_INVALIDATION_GROUPS.demande,
    [NOTIFICATION_TYPE.CONTROLE]: QUERY_INVALIDATION_GROUPS.demande,
    [NOTIFICATION_TYPE.APPROVISIONNEMENT]: [
        QueryCacheKey.APPROVISIONNEMENT,
        QueryCacheKey.BONS_MAGASIN,
        QueryCacheKey.BONS_SORTIE,
        QueryCacheKey.DEMANDE_ACHAT,
    ],
    [NOTIFICATION_TYPE.ACHAT]: QUERY_INVALIDATION_GROUPS.achat,
    [NOTIFICATION_TYPE.LIVRAISON]: QUERY_INVALIDATION_GROUPS.livraison,
    [NOTIFICATION_TYPE.RECEPTION]: QUERY_INVALIDATION_GROUPS.reception,
    [NOTIFICATION_TYPE.ALERTE]: [],
};

export const ALL_INVALIDATION_KEYS: QueryCacheKey[] = Array.from(
    new Set(Object.values(QUERY_INVALIDATION_GROUPS).flat()),
);
