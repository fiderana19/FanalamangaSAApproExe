import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { CheckCircle2, CircleX, FileDown, PackageSearch } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PageActionBar from "@/components/ui/PageActionBar";
import DemandeAchatStatutBadge from "@/components/status/DemandeAchatStatutBadge";
import HistoriqueAchat from "@/components/demandeachat/HistoriqueAchat";
import { downloadBlob, generateDemandeAchatBlob } from "@/utils/DemandeAchatPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { useGetDemandeAchat } from "@/hooks/useGetDemandeAchat";
import { useChangerStatutDemandeAchat } from "@/hooks/useChangerStatutDemandeAchat";
import { useAddStock } from "@/hooks/useAddStock";
import { DemandeAchatInterface, LigneDemandeAchatInterface } from "@/interfaces/DemandeAchat";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const DemandeAchatViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: demandeAchat, isLoading, isError } = useGetDemandeAchat(id);
  const changerStatut = useChangerStatutDemandeAchat();
  const addStock = useAddStock();
  const [terminerDialogOpen, setTerminerDialogOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const appro = demandeAchat?.approvisionnement ?? null;
  const demandeur = appro?.bonMagasin?.demande?.demandeur ?? null;
  const service = demandeur?.service ?? null;
  const lignes: LigneDemandeAchatInterface[] = demandeAchat?.lignes ?? [];
  const enCours = demandeAchat?.statutActuelDemandeAchat === "en_cours";

  const handleTerminer = async () => {
    if (!id) {
      return;
    }
    try {
      await changerStatut.mutateAsync({ id, statut: "termine" });
    } catch {
      return;
    }

    const quantitesParReference = new Map<string, number>();
    lignes.forEach((ligne) => {
      const reference = ligne.ressource?.reference;
      if (!reference || !ligne.quantite || ligne.quantite <= 0) {
        return;
      }
      quantitesParReference.set(
        reference,
        (quantitesParReference.get(reference) ?? 0) + ligne.quantite,
      );
    });

    const items = Array.from(
      quantitesParReference,
      ([reference, valeur]) => ({ reference, valeur }),
    );

    if (items.length > 0) {
      try {
        await addStock.mutateAsync(items);
      } catch {
        // l'échec du stock est signalé par le hook, l'action métier est conservée
      }
    }

    setTerminerDialogOpen(false);
  };

  const handleGeneratePdf = async (value: DemandeAchatInterface) => {
    setPdfGenerating(true);
    try {
      const blob = await generateDemandeAchatBlob(value);
      downloadBlob(
        blob,
        `${sanitizeFileName(value.numeroDemandeAchat ?? "demande-achat")}.pdf`,
      );
    } catch {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    } finally {
      setPdfGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className='panel p-10 flex flex-col items-center justify-center gap-3'>
        <LoadingOutlined className='text-3xl text-brand' />
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  if (isError || !demandeAchat) {
    return (
      <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
        <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
          <CircleX className='w-6 h-6' />
        </div>
        <p className='text-sm text-gray-600'>
          La récupération de la demande d'achat a échoué.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 pb-14'>
      <div className='w-full panel p-6 flex items-center gap-5'>
        <div className='grid place-items-center size-12 rounded-lg bg-orange-50 text-orange-600 shrink-0'>
          <PackageSearch className='w-6 h-6' />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
          <h1 className='text-base font-bold truncate flex items-center gap-2'>
            <span className='truncate'>Demande d'achat</span>
            <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700 shrink-0'>
              {demandeAchat.numeroDemandeAchat}
            </span>
          </h1>
          <div className='flex items-center gap-2 flex-wrap text-sm text-muted-foreground'>
            <DemandeAchatStatutBadge statut={demandeAchat.statutActuelDemandeAchat} />
            <span className='truncate text-xs'>
              Créée le {formatDate(demandeAchat.dateDemandeAchat)}
            </span>
          </div>
        </div>
      </div>

      <PageActionBar>
        <Button
          type='button'
          variant='outline'
          onClick={() => handleGeneratePdf(demandeAchat)}
          disabled={pdfGenerating}
          className='shrink-0 shadow-md'
        >
          {pdfGenerating ? <LoadingOutlined /> : <FileDown />}
          Générer le PDF
        </Button>
        {enCours && (
          <Button
            type='button'
            variant='brand'
            onClick={() => setTerminerDialogOpen(true)}
            className='shrink-0 shadow-md'
          >
            <CheckCircle2 /> Marquer comme terminé
          </Button>
        )}
      </PageActionBar>

      <div className='grid gap-6 items-start lg:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='flex flex-col gap-6'>
          <div className='panel p-6'>
            <h2 className='text-sm font-semibold text-gray-700 mb-4'>
              Approvisionnement lié
            </h2>
            {appro ? (
              <div className='grid gap-3 text-sm'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>N° approvisionnement</span>
                  <span className='inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700'>
                    {appro.numeroApprovisionnement}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Date</span>
                  <span className='font-medium text-foreground'>
                    {formatDate(appro.dateApprovisionnement)}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Objet</span>
                  <span className='font-medium text-foreground truncate max-w-[260px]'>
                    {appro.bonMagasin?.objet ?? "—"}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Demandeur</span>
                  <span className='font-medium text-foreground'>
                    {demandeur ? `${demandeur.nom} ${demandeur.prenom}` : "—"}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Service</span>
                  <span className='font-medium text-foreground truncate max-w-[260px]'>
                    {[service?.sigleService, service?.nomService].filter(Boolean).join(" - ") || "—"}
                  </span>
                </div>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>—</p>
            )}
          </div>

          <div className='panel overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0'>
              <h2 className='text-sm font-semibold text-gray-700'>
                {pluriel(lignes.length, "Ressource", "Ressources")}{" "}
                <span className='ml-1 text-muted-foreground font-normal'>
                  ({lignes.length})
                </span>
              </h2>
            </div>
            <div className='overflow-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50/80 sticky top-0 z-10'>
                  <tr className='border-b border-brand-border'>
                    <th className='px-6 py-3.5 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                      Référence
                    </th>
                    <th className='px-6 py-3.5 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                      Désignation
                    </th>
                    <th className='px-6 py-3.5 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                      Quantité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.length === 0 ? (
                    <tr className='border-b border-[#f1f5f9] last:border-b-0'>
                      <td
                        colSpan={3}
                        className='px-6 py-8 text-center text-brand-muted'
                      >
                        Aucune ressource dans cette demande d'achat.
                      </td>
                    </tr>
                  ) : (
                    lignes.map((ligne) => (
                      <tr
                        key={ligne._id}
                        className='border-b border-[#f1f5f9] last:border-b-0'
                      >
                        <td className='px-6 py-3 whitespace-nowrap'>
                          <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                            {ligne.ressource?.reference ?? "—"}
                          </span>
                        </td>
                        <td className='px-6 py-3'>
                          <span className='text-gray-700 truncate'>
                            {ligne.ressource?.designationRessource ?? "—"}
                          </span>
                        </td>
                        <td className='px-6 py-3 text-right whitespace-nowrap'>
                          <span className='inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 font-mono text-xs font-semibold text-orange-700'>
                            {ligne.quantite}
                            {ligne.ressource?.unite
                              ? ` ${getUniteLabel(ligne.ressource.unite)}`
                              : ""}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <HistoriqueAchat demandeAchatId={demandeAchat._id} />
      </div>

      <ConfirmDialog
        open={terminerDialogOpen}
        title="Marquer la demande d'achat comme terminée ?"
        description={
          <>
            L'approvisionnement lié repassera au statut{" "}
            <b>En cours</b>. Cette action est définitive.
          </>
        }
        confirmLabel="Marquer comme terminé"
        loadingLabel="Traitement…"
        loading={changerStatut.isPending || addStock.isPending}
        onConfirm={handleTerminer}
        onCancel={() => setTerminerDialogOpen(false)}
      />
    </div>
  );
};

export default DemandeAchatViewPage;
