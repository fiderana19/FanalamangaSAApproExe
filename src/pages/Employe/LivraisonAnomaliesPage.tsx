import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { AlertTriangle, CircleX, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LivraisonStatutBadge from "@/components/status/LivraisonStatutBadge";
import StatutReceptionBadge from "@/components/status/StatutReceptionBadge";
import LigneSortieStatutBadge from "@/components/status/LigneSortieStatutBadge";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetAnomaliesParSortie } from "@/hooks/useGetAnomaliesParSortie";
import { LigneSortieInterface } from "@/interfaces/BonSortie";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";
import { getRessource } from "@/utils/Ressource";

const LivraisonAnomaliesPage: React.FC = () => {
  const navigate = useNavigate();
  const { sortieId } = useParams<{ sortieId: string }>();
  const { data, isLoading, isError } = useGetAnomaliesParSortie(sortieId);

  if (isLoading) {
    return (
      <div className='panel p-10 flex flex-col items-center justify-center gap-3'>
        <LoadingOutlined className='text-3xl text-brand' />
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  if (isError || !sortieId) {
    return (
      <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
        <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
          <CircleX className='w-6 h-6' />
        </div>
        <p className='text-sm text-gray-600'>
          Impossible de charger les anomalies de ce bon de sortie.
        </p>
      </div>
    );
  }

  const anomalies = data.anomalies;

  if (anomalies.length === 0) {
    return (
      <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
        <div className='grid place-items-center size-12 rounded-lg bg-amber-50 text-amber-600'>
          <AlertTriangle className='w-6 h-6' />
        </div>
        <p className='text-sm text-gray-600'>
          Aucune anomalie de livraison n’est à régulariser pour ce bon de sortie.
        </p>
        <Button
          type='button'
          variant='outline'
          onClick={() => navigate("/employe/livraison/scan")}
        >
          Scanner un autre bon de sortie
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 pb-14'>
      <div className='w-full panel p-5 flex items-center gap-5'>
        <div className='grid place-items-center size-14 rounded-lg bg-amber-50 text-amber-600 shrink-0'>
          <AlertTriangle className='w-7 h-7' />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
          <h1 className='text-lg font-bold truncate'>Anomalies de livraison</h1>
          <p className='text-sm text-muted-foreground'>
            Sélectionnez la livraison à régulariser pour corriger les ressources
            non reçues ou la non-conformité de la réception.
          </p>
        </div>
      </div>

      {anomalies.map((item) => {
        const reception = item.reception;
        const lignesNonRecues = item.anomalies.lignesNonRecues;
        const receptionRegularisee =
          reception?.statutConformite === "regularisee";
        return (
          <div
            key={item.livraison._id}
            className='panel overflow-hidden rounded-lg'
          >
            <div className='flex flex-wrap items-center justify-between gap-3 border-b border-brand-border px-5 py-4'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                    {item.livraison.numeroLivraison}
                  </span>
                  <LivraisonStatutBadge
                    statut={item.livraison.statutLivraison}
                  />
                  <StatutReceptionBadge
                    statut={item.livraison.statutReception}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Livrée le{" "}
                  {item.livraison.dateLivraison
                    ? formatDate(item.livraison.dateLivraison)
                    : "—"}
                </p>
              </div>
              {reception && (
                <Button
                  type='button'
                  variant='brand'
                  onClick={() =>
                    navigate(
                      `/employe/livraison/regularisation/${sortieId}/${reception._id}`,
                    )
                  }
                >
                  <RefreshCw className='size-4' />
                  Régulariser
                </Button>
              )}
            </div>

            <div className='grid gap-4 p-5 md:grid-cols-2'>
              <div className='rounded-lg border border-brand-border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <h2 className='text-sm font-semibold text-gray-700'>
                    Réception
                  </h2>
                  {reception && (
                    <StatutReceptionBadge
                      statut={reception.statutConformite}
                    />
                  )}
                </div>
                {reception ? (
                  <div className='mt-3 grid gap-2 text-sm text-gray-700'>
                    <div>
                      <span className='text-[11px] uppercase tracking-wider text-muted-foreground'>
                        N° réception
                      </span>
                      <div className='font-mono text-xs font-semibold'>
                        {reception.numeroReception}
                      </div>
                    </div>
                    <div>
                      <span className='text-[11px] uppercase tracking-wider text-muted-foreground'>
                        Date de réception
                      </span>
                      <div>{formatDate(reception.dateReception)}</div>
                    </div>
                    <div>
                      <span className='text-[11px] uppercase tracking-wider text-muted-foreground'>
                        Conformité
                      </span>
                      <div>
                        {item.anomalies.receptionNonConforme
                          ? "Réception non conforme à régulariser"
                          : receptionRegularisee
                            ? "Réception déjà régularisée"
                            : "Réception conforme"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className='mt-3 text-sm text-muted-foreground'>
                    Aucune réception enregistrée.
                  </p>
                )}
              </div>

              <div className='rounded-lg border border-brand-border p-4'>
                <h2 className='text-sm font-semibold text-gray-700'>
                  {pluriel(
                    lignesNonRecues.length,
                    "Ressource non reçue",
                    "Ressources non reçues",
                  )}{" "}
                  <span className='font-normal text-muted-foreground'>
                    ({lignesNonRecues.length})
                  </span>
                </h2>
                {lignesNonRecues.length > 0 ? (
                  <ul className='mt-3 flex flex-col gap-3'>
                    {lignesNonRecues.map((ligne: LigneSortieInterface) => {
                      const ressource = getRessource(
                        ligne.ligneBonMagasin?.ligneDemande?.ressource,
                      );
                      return (
                        <li
                          key={ligne._id}
                          className='flex items-start justify-between gap-3 border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0'
                        >
                          <div className='flex flex-col gap-1'>
                            <span className='text-sm font-medium text-gray-700'>
                              {ressource?.designationRessource ??
                                "Ressource inconnue"}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {ligne.quantiteLigneSortie}{" "}
                              {ressource?.unite
                                ? getUniteLabel(ressource.unite)
                                : ""}
                            </span>
                            {ressource?.categorie && (
                              <RessourceCategorieBadge
                                categorie={ressource.categorie}
                              />
                            )}
                          </div>
                          <LigneSortieStatutBadge
                            statut={ligne.statutLigneSortie}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className='mt-3 text-sm text-muted-foreground'>
                    Aucune ressource non reçue.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LivraisonAnomaliesPage;
