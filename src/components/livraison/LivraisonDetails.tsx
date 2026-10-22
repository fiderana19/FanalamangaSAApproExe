import React, { useState } from "react";
import { FileDown, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageActionBar from "@/components/ui/PageActionBar";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import LivraisonStatutBadge from "@/components/status/LivraisonStatutBadge";
import LigneSortieStatutBadge from "@/components/status/LigneSortieStatutBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { getDirectionLabel } from "@/constants/Direction";
import { LivraisonInterface } from "@/interfaces/Livraison";
import { LigneSortieInterface } from "@/interfaces/BonSortie";
import { formatDate } from "@/utils/Date";
import { downloadBlob } from "@/utils/BonMagasinPdf";
import { generateReceptionBlob } from "@/utils/ReceptionPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { pluriel } from "@/utils/Pluriel";
import { getRessource } from "@/utils/Ressource";

interface LivraisonDetailsProps {
  livraison: LivraisonInterface;
  afficherBonReception?: boolean;
}

const LivraisonDetails: React.FC<LivraisonDetailsProps> = ({
  livraison,
  afficherBonReception = false,
}) => {
  const sortie = livraison.sortie;
  const appro = sortie?.approvisionnement ?? null;
  const bonMagasin = appro?.bonMagasin ?? null;
  const demande = bonMagasin?.demande ?? null;
  const demandeur = demande?.demandeur ?? null;
  const service = demandeur?.service;
  const reception = livraison.reception;
  const agent = livraison.utilisateur;

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleGeneratePdf = async () => {
    if (!reception) {
      return;
    }
    setPdfGenerating(true);
    try {
      const blob = await generateReceptionBlob(livraison);
      downloadBlob(blob, `${sanitizeFileName(reception.numeroReception)}.pdf`);
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
    <div className='flex flex-col gap-5 pb-14'>
      <div className='w-full panel p-5 flex items-center gap-5'>
        <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
          <Truck className='w-7 h-7' />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
          <h1 className='text-lg font-bold truncate flex items-center gap-2'>
            <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700'>
              {livraison.numeroLivraison}
            </span>
            <span className='truncate'>Livraison</span>
          </h1>
          <div className='flex items-center gap-2 flex-wrap'>
            <LivraisonStatutBadge statut={livraison.statutLivraison} size='md' />
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-5 items-start ${reception ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
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
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Demandeur</div>
              <div className='text-sm text-gray-700'>
                {demandeur ? `${demandeur.nom ?? ""} ${demandeur.prenom ?? ""}`.trim() : "—"}
              </div>
            </div>
            <div>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date de création</div>
              <div className='text-sm text-gray-700'>{formatDate(livraison.dateCreationLivraison)}</div>
            </div>
            <div>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date de livraison</div>
              <div className='text-sm text-gray-700'>
                {livraison.dateLivraison ? formatDate(livraison.dateLivraison) : "—"}
              </div>
            </div>
            <div>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Agent</div>
              <div className='text-sm text-gray-700'>
                {agent ? `${agent.nom ?? ""} ${agent.prenom ?? ""}`.trim() : "—"}
              </div>
            </div>
            <div>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Bon de sortie lié</div>
              <div className='text-sm text-gray-700'>
                {sortie ? (
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                    {sortie.numeroSortie}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>—</span>
                )}
              </div>
            </div>
            <div>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Approvisionnement lié</div>
              <div className='text-sm text-gray-700'>
                {appro ? (
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                    {appro.numeroApprovisionnement}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>—</span>
                )}
              </div>
            </div>
            <div className='sm:col-span-2'>
              <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Objet</div>
              <div className='text-sm text-gray-700'>{bonMagasin?.objet || "—"}</div>
            </div>
            {livraison.commentaireLivraison?.trim() && (
              <div className='sm:col-span-2'>
                <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Commentaire</div>
                <div className='text-sm text-gray-700'>{livraison.commentaireLivraison}</div>
              </div>
            )}
          </div>
        </div>

        {reception && (
          <div className='flex flex-col gap-5'>
            <div className='panel p-5'>
              <div className='flex items-center gap-2 mb-3'>
                <PackageCheck className='size-4 text-teal-600' />
                <h2 className='text-sm font-semibold text-gray-700'>Réception liée</h2>
              </div>
              <div className='grid gap-y-3'>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>N° réception</div>
                  <div className='text-sm text-gray-700'>
                    <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                      {reception.numeroReception}
                    </span>
                  </div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date de réception</div>
                  <div className='text-sm text-gray-700'>{formatDate(reception.dateReception)}</div>
                </div>
                <div>
                  <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Conformité</div>
                  <div className='text-sm text-gray-700'>
                    {reception.estConforme ? "Conforme" : "Non conforme"}
                  </div>
                </div>
                {reception.commentaireReception?.trim() && (
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Commentaire</div>
                    <div className='text-sm text-gray-700'>{reception.commentaireReception}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
          <h2 className='text-sm font-semibold text-gray-700'>
            {pluriel(livraison.lignes?.length ?? 0, "Ressource livrée", "Ressources livrées")}{" "}
            {livraison.lignes && livraison.lignes.length > 0 && (
              <span className='ml-1 text-muted-foreground font-normal'>
                ({livraison.lignes.length})
              </span>
            )}
          </h2>
        </div>
        <div className='overflow-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50/80 sticky top-0 z-10'>
              <tr className='border-b border-brand-border'>
                <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité BM</th>
                <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité BSM</th>
                <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Unité</th>
                <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Observation</th>
                <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Statut</th>
              </tr>
            </thead>
            <tbody>
              {livraison.lignes && livraison.lignes.length > 0 ? (
                livraison.lignes.map((ligne: LigneSortieInterface) => {
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
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <LigneSortieStatutBadge statut={ligne.statutLigneSortie} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className='border-b transition-colors hover:bg-muted/50'>
                  <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                    Aucune ressource livrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {reception && afficherBonReception && (
        <PageActionBar>
          <Button
            type='button'
            variant='secondary'
            onClick={handleGeneratePdf}
            disabled={pdfGenerating}
            className='shrink-0 shadow-md'
          >
            {pdfGenerating ? (
              <span className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : (
              <FileDown className='size-4' />
            )}
            Générer le bon de réception
          </Button>
        </PageActionBar>
      )}
    </div>
  );
};

export default LivraisonDetails;
