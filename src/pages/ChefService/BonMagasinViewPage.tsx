import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ClipboardList, EllipsisVertical, FileDown, Warehouse } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import BonMagasinStatutBadge from "@/components/status/BonMagasinStatutBadge";
import UrgentBadge from "@/components/common/UrgentBadge";
import PageActionBar from "@/components/ui/PageActionBar";
import { downloadBlob, generateBonMagasinBlob } from "@/utils/BonMagasinPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { getDirectionLabel } from "@/constants/Direction";
import { useGetBonMagasin } from "@/hooks/useGetBonMagasin";
import { BonMagasinInterface, LigneBonMagasinInterface } from "@/interfaces/BonMagasin";
import { formatDate } from "@/utils/Date";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const DEMANDE_VIEW_ROUTE_PREFIX = "/chef_service/demande/view";

const BonMagasinViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: bon, isLoading, isError } = useGetBonMagasin(id);

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleGeneratePdf = async (value: BonMagasinInterface) => {
    setPdfGenerating(true);
    try {
      const blob = await generateBonMagasinBlob(value);
      downloadBlob(blob, `${sanitizeFileName(value.numeroBonMagasin)}.pdf`);
    } catch {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className='relative flex flex-col'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !bon ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement du bon de magasin.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-teal-50 text-teal-600 shrink-0'>
              <Warehouse className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate flex items-center gap-2'>
                <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-sm font-semibold text-teal-700'>
                  {bon.numeroBonMagasin}
                </span>
                <span className='truncate'>{bon.objet}</span>
              </h1>
              <div className='flex items-center gap-2 flex-wrap'>
                <BonMagasinStatutBadge statut={bon.statutBonMagasin} size='md' />
                {bon.demande?.urgence && <UrgentBadge />}
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-label='Actions'
                  className='text-gray-500 hover:text-brand hover:bg-[#e9f5ee] shrink-0'
                >
                  <EllipsisVertical />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-52 p-1'>
                {bon.demande && (
                  <button
                    type='button'
                    onClick={() =>
                      navigate(`${DEMANDE_VIEW_ROUTE_PREFIX}/${bon.demande?._id}`)
                    }
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                  >
                    <ClipboardList /> Voir la demande
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <PageActionBar>
            <Button
              type='button'
              variant='secondary'
              onClick={() => handleGeneratePdf(bon)}
              disabled={pdfGenerating}
              className='shrink-0 shadow-md'
            >
              {pdfGenerating ? <LoadingOutlined /> : <FileDown />}
              Générer le bon de magasin
            </Button>
          </PageActionBar>

          <div className='mt-5 flex flex-col gap-5 pb-14'>
            <div className='panel p-5'>
              <h2 className='text-sm font-semibold mb-3 text-gray-700'>Informations</h2>
              <div className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Direction</div>
                  <div className='text-sm text-gray-700'>
                    {getDirectionLabel(bon.demande?.demandeur?.service?.direction) || "—"}
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Service</div>
                  <div className='text-sm text-gray-700'>
                    {[bon.demande?.demandeur?.service?.sigleService, bon.demande?.demandeur?.service?.nomService]
                      .filter(Boolean)
                      .join(" - ") || "—"}
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Affectation</div>
                  <div className='text-sm text-gray-700'>{bon.demande?.demandeur?.service?.lieuService ?? "—"}</div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Objet</div>
                  <div className='text-sm text-gray-700'>{bon.objet}</div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date du bon</div>
                  <div className='text-sm text-gray-700'>{formatDate(bon.dateBonMagasin)}</div>
                </div>
              </div>
            </div>

            <div className='panel flex flex-col overflow-hidden rounded-lg'>
              <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
                <h2 className='text-sm font-semibold text-gray-700'>
                  {pluriel(bon.lignes?.length ?? 0, "Ressource", "Ressources")}{" "}
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
                      <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité</th>
                      <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bon.lignes && bon.lignes.length > 0 ? (
                      bon.lignes.map((ligne: LigneBonMagasinInterface) => {
                        const ressource = getRessource(ligne.ligneDemande?.ressource);
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
                            <td className='px-4 py-3 whitespace-nowrap font-semibold text-gray-700'>
                              {ligne.quantiteLigneBonMagasin}
                              {ressource?.unite && (
                                <span className='ml-1 font-normal text-gray-500'>
                                  {getUniteLabel(ressource.unite)}
                                </span>
                              )}
                            </td>
                            <td className='px-4 py-3 text-gray-600'>
                              {ligne.observation?.trim() ? ligne.observation : ""}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className='border-b transition-colors hover:bg-muted/50'>
                        <td colSpan={3} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                          Aucune ressource
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
    </div>
  );
};

export default BonMagasinViewPage;
