import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { FileDown, PackageOpen, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import PageActionBar from "@/components/ui/PageActionBar";
import BonSortieStatutBadge from "@/components/status/BonSortieStatutBadge";
import { downloadBlob, generateBonSortieBlob } from "@/utils/BonMagasinPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { getDirectionLabel } from "@/constants/Direction";
import { useGetBonSortie } from "@/hooks/useGetBonSortie";
import { useChangerStatutBonSortie } from "@/hooks/useChangerStatutBonSortie";
import { useGetLivraisonsParSortie } from "@/hooks/useGetLivraisonsParSortie";
import { BonSortieInterface, LigneSortieInterface } from "@/interfaces/BonSortie";
import { LivraisonInterface } from "@/interfaces/Livraison";
import { formatDate } from "@/utils/Date";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const BonSortieViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bon, isLoading, isError } = useGetBonSortie(id);
  const changerStatut = useChangerStatutBonSortie();
  const { data: livraisons } = useGetLivraisonsParSortie(id);

  const [livrerDialogOpen, setLivrerDialogOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const enPreparation = bon?.statutSortie === "en_preparation";
  const livraisonLiee: LivraisonInterface | null =
    (livraisons as LivraisonInterface[])?.[0] ?? null;

  const handleLivrer = () => {
    if (!id) {
      return;
    }
    changerStatut.mutate(
      { id, statut: "sorti" },
      {
        onSuccess: () => {
          setLivrerDialogOpen(false);
        },
      },
    );
  };

  const handleGeneratePdf = async (value: BonSortieInterface) => {
    setPdfGenerating(true);
    try {
      const blob = await generateBonSortieBlob(value);
      downloadBlob(blob, `${sanitizeFileName(value.numeroSortie)}.pdf`);
    } catch {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    } finally {
      setPdfGenerating(false);
    }
  };

  const bonMagasin = bon?.approvisionnement?.bonMagasin;
  const demande = bonMagasin?.demande;
  const demandeur = demande?.demandeur;
  const service = demandeur?.service;

  return (
    <div className='relative flex flex-col'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !bon ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement du bon de sortie de magasin.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-teal-50 text-teal-600 shrink-0'>
              <PackageOpen className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate flex items-center gap-2'>
                <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-sm font-semibold text-teal-700'>
                  {bon.numeroSortie}
                </span>
                <span className='truncate'>Bon de sortie de magasin</span>
              </h1>
              <div className='flex items-center gap-2 flex-wrap'>
                <BonSortieStatutBadge statut={bon.statutSortie} size='md' />
                {bon.apurement === 'total' && (
                  <span className='inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600'>
                    Apurement total
                  </span>
                )}
                {bon.apurement === 'partiel' && (
                  <span className='inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-600'>
                    Apurement partiel
                  </span>
                )}
              </div>
            </div>
          </div>

          <PageActionBar>
            {livraisonLiee && (
              <Button
                type='button'
                variant='secondary'
                onClick={() => navigate(`/agent_appro/livraison/view/${livraisonLiee._id}`)}
                className='shrink-0 shadow-md'
              >
                <Truck />
                Voir la livraison
              </Button>
            )}
            {enPreparation && (
              <Button
                type='button'
                variant='brand'
                onClick={() => setLivrerDialogOpen(true)}
                className='shrink-0 shadow-md'
              >
                <Truck />
                Livrer
              </Button>
            )}
            <Button
              type='button'
              variant='secondary'
              onClick={() => handleGeneratePdf(bon)}
              disabled={pdfGenerating}
              className='shrink-0 shadow-md'
            >
              {pdfGenerating ? <LoadingOutlined /> : <FileDown />}
              Générer le bon de sortie
            </Button>
          </PageActionBar>

          <div className='mt-5 flex flex-col gap-5 pb-14'>
            <div className='panel p-5'>
              <h2 className='text-sm font-semibold mb-3 text-gray-700'>Informations</h2>
              <div className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Direction</div>
                  <div className='text-sm text-gray-700'>
                    {getDirectionLabel(service?.direction) || "—"}
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Service</div>
                  <div className='text-sm text-gray-700'>
                    {[service?.sigleService, service?.nomService].filter(Boolean).join(" - ") || "—"}
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Affectation</div>
                  <div className='text-sm text-gray-700'>{service?.lieuService ?? "—"}</div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date de sortie</div>
                  <div className='text-sm text-gray-700'>{formatDate(bon.dateSortie)}</div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Statut</div>
                  <div className='text-sm text-gray-700'>
                    <BonSortieStatutBadge statut={bon.statutSortie} size='md' />
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Apurement</div>
                  <div className='text-sm text-gray-700'>
                    {bon.apurement === 'total' ? 'Total' : 'Partiel'}
                  </div>
                </div>
                <div className='sm:col-span-2'>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Objet</div>
                  <div className='text-sm text-gray-700'>{bonMagasin?.objet || "—"}</div>
                </div>
                <div className='sm:col-span-2'>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Approvisionnement lié</div>
                  <div className='text-sm text-gray-700'>
                    {bon.approvisionnement ? (
                      <>
                        <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 mr-2'>
                          {bon.approvisionnement.numeroApprovisionnement}
                        </span>
                        {bon.approvisionnement.objet}
                      </>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='panel flex flex-col overflow-hidden rounded-lg'>
              <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
                <h2 className='text-sm font-semibold text-gray-700'>
                  {pluriel(bon.lignes?.length ?? 0, "Ressource sortie", "Ressources sorties")}{" "}
                  {bon.lignes && bon.lignes.length > 0 && (
                    <span className='ml-1 text-muted-foreground font-normal'>
                      ({bon.lignes.length})
                    </span>
                  )}
                </h2>
              </div>
              <div className='overflow-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-gray-50/80 sticky top-0 z-10'>
                    <tr className='border-b border-brand-border'>
                      <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                      <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité bon de magasin</th>
                      <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité sortie</th>
                      <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Unité</th>
                      <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bon.lignes && bon.lignes.length > 0 ? (
                      bon.lignes.map((ligne: LigneSortieInterface) => {
                        const ligneBonMagasin = ligne.ligneBonMagasin;
                        const ressource = getRessource(ligneBonMagasin?.ligneDemande?.ressource);
                        return (
                          <tr
                            key={ligne._id}
                            className='border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0'
                          >
                            <td className='px-4 py-3'>
                              {ressource ? (
                                <div className='flex flex-col gap-1'>
                                  <span className='font-medium text-foreground'>
                                    <span className='mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                                      {ressource.reference}
                                    </span>
                                    {ressource.designationRessource}
                                  </span>
                                  <RessourceCategorieBadge categorie={ressource.categorie} />
                                </div>
                              ) : (
                                <span className='text-muted-foreground' />
                              )}
                            </td>
                            <td className='px-4 py-3 text-right whitespace-nowrap font-semibold text-gray-700'>
                              {ligneBonMagasin?.quantiteLigneBonMagasin ?? "—"}
                              {ressource?.unite && (
                                <span className='ml-1 font-normal text-gray-500'>
                                  {getUniteLabel(ressource.unite)}
                                </span>
                              )}
                            </td>
                            <td className='px-4 py-3 text-right whitespace-nowrap font-semibold text-gray-700'>
                              {ligne.quantiteLigneSortie}
                            </td>
                            <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
                              {ressource?.unite ? getUniteLabel(ressource.unite) : "—"}
                            </td>
                            <td className='px-4 py-3 text-gray-600'>
                              {ligne.observation?.trim() ? ligne.observation : ""}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className='border-b transition-colors hover:bg-muted/50'>
                        <td colSpan={5} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                          Aucune ressource sortie
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={livrerDialogOpen}
        title="Livrer ce bon de sortie ?"
        description={
          <>
            Le bon de sortie <b>{bon?.numeroSortie}</b> va être livré. Une
            livraison sera automatiquement créée et l'approvisionnement lié sera
            mis à jour.
          </>
        }
        warning="Cette action est définitive."
        tone="brand"
        confirmVariant="brand"
        confirmLabel="Livrer"
        loadingLabel="Traitement…"
        loading={changerStatut.isPending}
        icon={<Truck className='size-6 text-brand' />}
        onConfirm={handleLivrer}
        onCancel={() => setLivrerDialogOpen(false)}
      />
    </div>
  );
};

export default BonSortieViewPage;