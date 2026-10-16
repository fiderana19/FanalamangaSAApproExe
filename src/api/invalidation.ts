import type { QueryClient } from "@tanstack/react-query";
import { QueryCacheKey } from "@/api/QueryCacheKey";

export const invalidateKeys = (
  queryClient: QueryClient,
  keys: QueryCacheKey[],
): Promise<void[]> =>
  Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  );

export const QUERY_INVALIDATION_GROUPS = {
  demande: [QueryCacheKey.DEMANDES],
  bonMagasin: [QueryCacheKey.DEMANDES, QueryCacheKey.BONS_MAGASIN],
  approFromBon: [QueryCacheKey.BONS_MAGASIN, QueryCacheKey.APPROVISIONNEMENT],
  achat: [
    QueryCacheKey.DEMANDE_ACHAT,
    QueryCacheKey.APPROVISIONNEMENT,
    QueryCacheKey.BONS_MAGASIN,
  ],
  sortie: [
    QueryCacheKey.BONS_SORTIE,
    QueryCacheKey.APPROVISIONNEMENT,
    QueryCacheKey.BONS_MAGASIN,
  ],
  sortieStatut: [
    QueryCacheKey.BONS_SORTIE,
    QueryCacheKey.LIVRAISON,
    QueryCacheKey.APPROVISIONNEMENT,
    QueryCacheKey.BONS_MAGASIN,
  ],
  livraison: [
    QueryCacheKey.LIVRAISON,
    QueryCacheKey.APPROVISIONNEMENT,
    QueryCacheKey.BONS_SORTIE,
  ],
  reception: [
    QueryCacheKey.RECEPTION,
    QueryCacheKey.LIVRAISON,
    QueryCacheKey.APPROVISIONNEMENT,
    QueryCacheKey.BONS_SORTIE,
  ],
  ressource: [QueryCacheKey.RESSOURCES],
  ressourceImpact: [
    QueryCacheKey.RESSOURCES,
    QueryCacheKey.DEMANDES,
    QueryCacheKey.DEMANDE_ACHAT,
  ],
  user: [QueryCacheKey.USERS],
  userPatch: [QueryCacheKey.USERS, QueryCacheKey.PROFILE],
  service: [QueryCacheKey.SERVICES, QueryCacheKey.LIEUX, QueryCacheKey.USERS],
  servicePatch: [
    QueryCacheKey.SERVICES,
    QueryCacheKey.USERS,
    QueryCacheKey.LIEUX,
  ],
  serviceDelete: [
    QueryCacheKey.SERVICES,
    QueryCacheKey.USERS,
    QueryCacheKey.LIEUX,
  ],
  responsabilite: [QueryCacheKey.RESPONSABILITES, QueryCacheKey.USERS],
} satisfies Record<string, QueryCacheKey[]>;
