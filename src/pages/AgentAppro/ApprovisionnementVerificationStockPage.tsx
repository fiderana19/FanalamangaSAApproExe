import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import {
  CircleX,
  PackageSearch,
  RefreshCw,
  SearchCheck,
  ShoppingCart,
  ShoppingBag,
  Warehouse,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import ApprovisionnementStatutBadge from "@/components/status/ApprovisionnementStatutBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import ApprovisionnementInfosDemandePanel from "@/components/approvisionnement/ApprovisionnementInfosDemandePanel";
import ApprovisionnementInfosApproPanel from "@/components/approvisionnement/ApprovisionnementInfosApproPanel";
import PageActionBar from "@/components/ui/PageActionBar";
import { useGetApprovisionnement } from "@/hooks/useGetApprovisionnement";
import { useGetBonMagasin } from "@/hooks/useGetBonMagasin";
import { useVerifierStock } from "@/hooks/useVerifierStock";
import { LigneBonMagasinInterface } from "@/interfaces/BonMagasin";
import { formatDate } from "@/utils/Date";
import { getReference } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";
import StockDispoBadge from "@/components/approvisionnement/StockDispoBadge";
import DispoVerdictIcon from "@/components/approvisionnement/DispoVerdictIcon";
import LigneBonMagasinStatutBadge from "@/components/status/LigneBonMagasinStatutBadge";
import { useGetDemandeAchatByAppro } from "@/hooks/useGetDemandeAchatByAppro";
import { useGetBonSortieByAppro } from "@/hooks/useGetBonSortieByAppro";

const ApprovisionnementVerificationStockPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: approvisionnement, isLoading: chargementAppro } = useGetApprovisionnement(id);
  const { data: bon, isLoading: chargementBon } = useGetBonMagasin(
    approvisionnement?.bonMagasin?._id
  );
  const verifierStock = useVerifierStock();

  const lignes = bon?.lignes ?? [];

  const lignesAVerifier = lignes.filter(
    (ligne: LigneBonMagasinInterface) =>
      ligne.statutLigneBonMagasin === "transmis" ||
      ligne.statutLigneBonMagasin === "achat_recu",
  );

  const references = lignesAVerifier
    .map((ligne: LigneBonMagasinInterface) => getReference(ligne.ligneDemande?.ressource))
    .filter(Boolean);

  const quantiteBonParRef = new Map<string, number>();
  lignesAVerifier.forEach((ligne: LigneBonMagasinInterface) => {
    const ref = getReference(ligne.ligneDemande?.ressource);
    if (ref) {
      quantiteBonParRef.set(ref, ligne.quantiteLigneBonMagasin);
    }
  });

  const dateVerification = React.useRef("");
  const lancerVerification = () => {
    if (references.length > 0) {
      dateVerification.current = new Date().toISOString();
      verifierStock.mutate(references);
    }
  };

  React.useEffect(() => {
    lancerVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bon?._id]);

  const stocks = verifierStock.data ?? [];
  const enChargement = chargementAppro || chargementBon;
  const recupEnCours = references.length > 0 && verifierStock.isPending;
  const resultatsPret =
    !verifierStock.isError && !recupEnCours && references.length > 0 && stocks.length > 0;

  const estSuffisant = (reference: string): boolean => {
    const stock = stocks.find((s: any) => s.reference === reference);
    return (
      !!stock &&
      typeof stock.quantiteStock === "number" &&
      stock.quantiteStock >= (quantiteBonParRef.get(reference) ?? 0)
    );
  };

  const estEligibleSortie = (ligne: LigneBonMagasinInterface): boolean =>
    ligne.statutLigneBonMagasin === "transmis" ||
    ligne.statutLigneBonMagasin === "achat_recu";

  const estDisponibleSortie = (ligne: LigneBonMagasinInterface): boolean => {
    if (!estEligibleSortie(ligne)) {
      return false;
    }
    if (ligne.statutLigneBonMagasin === "achat_recu") {
      return true;
    }
    const reference = getReference(ligne.ligneDemande?.ressource);
    return !!reference && estSuffisant(reference);
  };

  const auMoinsUneDisponible =
    resultatsPret && lignesAVerifier.some(estDisponibleSortie);

  const auMoinsUneIndisponible =
    resultatsPret &&
    lignesAVerifier.some(
      (ligne: LigneBonMagasinInterface) =>
        ligne.statutLigneBonMagasin === "transmis" &&
        (() => {
          const reference = getReference(ligne.ligneDemande?.ressource);
          return !!reference && !estSuffisant(reference);
        })(),
    );

  const { data: demandeAchatExistante } = useGetDemandeAchatByAppro(id);
  const { data: bonSorties } = useGetBonSortieByAppro(id);
  const bonSortiesExistants = Array.isArray(bonSorties)
    ? bonSorties
    : bonSorties
      ? [bonSorties]
      : [];

  const bonRef = approvisionnement?.bonMagasin ?? null;

  if (enChargement) {
    return (
      <div className='panel p-10 flex flex-col items-center justify-center gap-3'>
        <LoadingOutlined className='text-3xl text-brand' />
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 pb-14'>
      <div className='w-full panel p-6 flex items-center gap-5'>
        <div className='grid place-items-center size-12 rounded-lg bg-teal-50 text-teal-600 shrink-0'>
          <PackageSearch className='w-6 h-6' />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
          <h1 className='text-base font-bold truncate flex items-center gap-2'>
            <span className='truncate'>Disponibilité des ressources</span>
            {approvisionnement?.numeroApprovisionnement && (
              <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 shrink-0'>
                {approvisionnement.numeroApprovisionnement}
              </span>
            )}
          </h1>
          <div className='flex items-center gap-2 flex-wrap text-sm text-muted-foreground'>
            {approvisionnement?.statutApprovisionnement && (
              <ApprovisionnementStatutBadge statut={approvisionnement.statutApprovisionnement} />
            )}
            <span className='truncate text-xs'>
              {dateVerification.current && `Actualisé le ${formatDate(dateVerification.current)}`}
            </span>
          </div>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <ApprovisionnementInfosDemandePanel demandeur={bonRef?.demande?.demandeur ?? null} />
        {approvisionnement && (
          <ApprovisionnementInfosApproPanel approvisionnement={approvisionnement} />
        )}
      </div>

      {verifierStock.isError ? (
        <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
          <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
            <CircleX className='w-6 h-6' />
          </div>
          <p className='text-sm text-gray-600'>La récupération du stock a échoué.</p>
          <Button type='button' variant='brand' onClick={lancerVerification}>
            <RefreshCw /> Réessayer
          </Button>
        </div>
      ) : references.length === 0 ? (
        <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
          <div className='grid place-items-center size-12 rounded-lg bg-gray-100 text-gray-500'>
            <SearchCheck className='w-6 h-6' />
          </div>
          <p className='text-sm text-gray-600'>Aucune ressource à vérifier.</p>
        </div>
      ) : recupEnCours ? (
        <div className='panel p-8 flex flex-col items-center justify-center gap-3'>
          <LoadingOutlined className='text-3xl text-brand' />
          <p className='text-sm text-muted-foreground'>Récupération du stock…</p>
        </div>
      ) : (
        <div className='panel overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0'>
              <h2 className='text-sm font-semibold text-gray-700'>
                {pluriel(references.length, "Disponibilité de la ressource", "Disponibilité des ressources")}{" "}
                <span className='ml-1 text-muted-foreground font-normal'>
                  ({references.length})
                </span>
              </h2>
            </div>
            <div className='overflow-auto max-h-[42vh]'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50/80 sticky top-0 z-10'>
                  <tr className='border-b border-brand-border'>
                    <th className='px-6 py-3.5 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                    <th className='px-6 py-3.5 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Désignation</th>
                    <th className='px-6 py-3.5 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité bon</th>
                    <th className='px-6 py-3.5 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité en stock</th>
                    <th className='px-6 py-3.5 text-center align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Résultat</th>
                    <th className='px-6 py-3.5 text-center align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Suivi</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesAVerifier.length === 0 ? (
                    <tr className='border-b border-[#f1f5f9] last:border-b-0'>
                      <td colSpan={6} className='px-6 py-8 text-center text-brand-muted'>
                        Aucune ressource à afficher.
                      </td>
                    </tr>
                  ) : (
                    lignesAVerifier.map((ligne: LigneBonMagasinInterface) => {
                      const reference = getReference(ligne.ligneDemande?.ressource);
                      const stock = stocks.find((s: any) => s.reference === reference);
                      const quantiteStock =
                        stock && typeof stock.quantiteStock === "number" ? stock.quantiteStock : null;
                      const quantiteBon = quantiteBonParRef.get(reference ?? "") ?? 0;
                      const suffisant =
                        ligne.statutLigneBonMagasin === "achat_recu" ||
                        (quantiteStock !== null && quantiteStock >= quantiteBon);
                      return (
                        <tr
                          key={ligne._id}
                          className='border-b border-[#f1f5f9] transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0'
                        >
                          <td className='px-6 py-3 whitespace-nowrap'>
                            <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                              {reference}
                            </span>
                          </td>
                          <td className='px-6 py-3'>
                            <div className='flex flex-col items-start gap-1'>
                              <span className='text-gray-700 truncate'>
                                {stock?.designationRessource ?? "Ressource introuvable en stock"}
                              </span>
                              {stock && (
                                <span className='flex items-center gap-1.5 flex-wrap'>
                                  <RessourceCategorieBadge categorie={stock.categorie} />
                                  {stock.unite && (
                                    <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600'>
                                      {getUniteLabel(stock.unite)}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-3 text-right whitespace-nowrap'>
                            <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                              {quantiteBon}
                            </span>
                          </td>
                          <td className='px-6 py-3 text-right whitespace-nowrap'>
                            <StockDispoBadge quantite={quantiteStock} />
                          </td>
                          <td className='px-6 py-3 text-center whitespace-nowrap'>
                            <DispoVerdictIcon suffisant={suffisant} />
                          </td>
                          <td className='px-6 py-3 text-center whitespace-nowrap'>
                            <LigneBonMagasinStatutBadge statut={ligne.statutLigneBonMagasin} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
          </div>
        </div>
      )}

      <PageActionBar>
        {bonSortiesExistants.length > 0 && (
          <Button type='button' variant='outline' className='shrink-0 shadow-md' disabled>
            <Warehouse />
            {bonSortiesExistants.length > 1
              ? `${bonSortiesExistants.length} bons de sortie de magasin déjà établis`
              : "Bon de sortie de magasin déjà établi"}
          </Button>
        )}
        {auMoinsUneDisponible && (
          <Button
            type='button'
            variant='brand'
            onClick={() => navigate(`/agent_appro/bon-sortie/create/${id}`)}
            className='shrink-0 shadow-md'
          >
            <Warehouse />
            Établir un bon de sortie de magasin
          </Button>
        )}
        {auMoinsUneIndisponible && !demandeAchatExistante && (
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate(`/agent_appro/demande-achat/create/${id}`)}
            className='shrink-0 shadow-md'
          >
            <ShoppingCart />
            Faire une demande d'achat
          </Button>
        )}
        {demandeAchatExistante && (
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              navigate(`/agent_appro/demande-achat/view/${demandeAchatExistante._id}`)
            }
            className='shrink-0 shadow-md'
          >
            <ShoppingBag />
            Voir la demande d'achat
          </Button>
        )}
      </PageActionBar>
    </div>
  );
};

export default ApprovisionnementVerificationStockPage;
