import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ClipboardList, EllipsisVertical, Warehouse, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PageActionBar from "@/components/ui/PageActionBar";
import DemandeStatutBadge from "@/components/status/DemandeStatutBadge";
import LigneStatutBadge from "@/components/status/LigneStatutBadge";
import LigneFormDialog from "@/components/demandes/LigneFormDialog";
import HistoriqueDemande from "@/components/demandes/HistoriqueDemande";
import DemandeTraitementsDetails from "@/components/demandes/DemandeTraitementsDetails";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { getDirectionLabel } from "@/constants/Direction";
import { useGetDemande } from "@/hooks/useGetDemande";
import { useDeleteDemande } from "@/hooks/useDeleteDemande";
import { useDeleteLigne } from "@/hooks/useDeleteLigne";
import { LigneDemandeInterface } from "@/interfaces/Demande";
import { formatDate } from "@/utils/Date";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const DemandeViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError } = useGetDemande(id);
  const estEnAttente = demande?.statutActuelDemande === "en_attente";
  const estControlee = demande?.statutActuelDemande === "controlee";
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [ligneDialogOpen, setLigneDialogOpen] = useState<boolean>(false);
  const [editingLigne, setEditingLigne] = useState<LigneDemandeInterface | null>(null);
  const [ligneToDelete, setLigneToDelete] = useState<LigneDemandeInterface | null>(null);
  const [menuLigneId, setMenuLigneId] = useState<string | null>(null);

  const { mutateAsync: deleteDemande, isPending: isDeleting } = useDeleteDemande({
    action() {
      navigate("/employe/demande");
    },
  });
  const { mutateAsync: deleteLigne, isPending: isDeletingLigne } = useDeleteLigne();

  const handleDelete = async () => {
    if (!demande) {
      return;
    }
    try {
      await deleteDemande(demande._id);
    } catch {
      return;
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleDeleteLigne = async () => {
    if (!demande || !ligneToDelete) {
      return;
    }
    try {
      await deleteLigne({ demandeId: demande._id, ligneId: ligneToDelete._id });
    } catch {
      return;
    } finally {
      setLigneToDelete(null);
    }
  };

  const openCreateLigne = () => {
    setEditingLigne(null);
    setLigneDialogOpen(true);
  };

  const openEditLigne = (ligne: LigneDemandeInterface) => {
    setMenuLigneId(null);
    setEditingLigne(ligne);
    setLigneDialogOpen(true);
  };

  return (
    <div className='flex flex-col pb-14'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !demande ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement de la demande.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <ClipboardList className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate flex items-center gap-2'>
                <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700'>
                  {demande.numeroDemande}
                </span>
                <span className='truncate'>{demande.motif}</span>
              </h1>
              <div className='flex items-center gap-2 flex-wrap'>
                <DemandeStatutBadge statut={demande.statutActuelDemande} size='md' />
                {demande.urgence && (
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600'>
                    <Zap className='size-4' /> Urgent
                  </span>
                )}
              </div>
            </div>
            {estEnAttente && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Actions'
                    className='shrink-0 text-gray-500 hover:text-brand hover:bg-[#e9f5ee]'
                  >
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='end' className='w-52 p-1'>
                  <button
                    type='button'
                    onClick={() => navigate(`/employe/demande/edit/${demande._id}`)}
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                  >
                    <EditOutlined /> Modifier
                  </button>
                  <button
                    type='button'
                    onClick={() => setConfirmOpen(true)}
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10'
                  >
                    <DeleteOutlined /> Supprimer
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <PageActionBar>
            {estControlee && (
              <Button
                type='button'
                variant='brand'
                onClick={() => navigate(`/employe/demande/bon-magasin/${demande._id}`)}
                className='shrink-0 shadow-md'
              >
                <Warehouse /> Faire un bon de magasin
              </Button>
            )}
          </PageActionBar>

          <div className='mt-5 grid grid-cols-1 gap-5 items-start lg:grid-cols-[minmax(0,1fr)_320px]'>
            <div className='flex flex-col gap-5'>
              <div className='panel p-5'>
                <h2 className='text-sm font-semibold mb-3 text-gray-700'>
                  Informations
                </h2>
                <div className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Date demande</div>
                    <div className='text-sm text-gray-700'>{formatDate(demande.dateDemande)}</div>
                  </div>
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Demandeur</div>
                    <div className='text-sm text-gray-700'>
                      {demande.demandeur
                        ? `${demande.demandeur.nom ?? ""} ${demande.demandeur.prenom ?? ""}`.trim()
                        : ""}
                    </div>
                  </div>
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Motif</div>
                    <div className='text-sm text-gray-700'>{demande.motif}</div>
                  </div>
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Direction</div>
                    <div className='text-sm text-gray-700'>
                      {getDirectionLabel(demande.demandeur?.service?.direction)}
                    </div>
                  </div>
                  <div>
                    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>Service</div>
                    <div className='text-sm text-gray-700'>
                      {demande.demandeur?.service
                        ? `${demande.demandeur.service.nomService ?? ""}${demande.demandeur.service.lieuService ? ` — ${demande.demandeur.service.lieuService}` : ""}`.trim()
                        : ""}
                    </div>
                </div>
              </div>
            </div>

              <div className='panel flex flex-col overflow-hidden rounded-lg'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
                  <h2 className='text-sm font-semibold text-gray-700'>
                    {pluriel(demande.lignes?.length ?? 0, "Ressource de la demande", "Ressources de la demande")}{" "}
                    {demande.lignes && demande.lignes.length > 0 && (
                      <span className='ml-1 text-muted-foreground font-normal'>
                        ({demande.lignes.length})
                      </span>
                    )}
                  </h2>
                  {estEnAttente && (
                    <Button variant='brand' onClick={openCreateLigne} className='shrink-0'>
                      <PlusOutlined /> Ajouter une ressource
                    </Button>
                  )}
                </div>
                <div className='overflow-auto'>
                  <table className='w-full text-sm'>
                    <thead className='bg-gray-50/80 sticky top-0 z-10'>
                      <tr className='border-b border-brand-border'>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité</th>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Statut</th>
                        <th className='py-3 pr-4 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {demande.lignes && demande.lignes.length > 0 ? (
                        demande.lignes.map((ligne: LigneDemandeInterface) => {
                          const ressource = getRessource(ligne.ressource);
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
                                {ligne.quantite}
                                {ressource?.unite && (
                                  <span className='ml-1 font-normal text-gray-500'>
                                    {getUniteLabel(ressource.unite)}
                                  </span>
                                )}
                              </td>
                              <td className='px-4 py-3 whitespace-nowrap'>
                                <LigneStatutBadge statut={ligne.statutLigneDemande} />
                              </td>
                              <td className='pr-4 py-3'>
                                {estEnAttente && (
                                  <div className='flex justify-end'>
                                    <Popover
                                      open={menuLigneId === ligne._id}
                                      onOpenChange={(open) => setMenuLigneId(open ? ligne._id : null)}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          aria-label='Actions'
                                          className='text-gray-500 hover:text-brand hover:bg-[#e9f5ee]'
                                        >
                                          <EllipsisVertical />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent align='end' className='w-52 p-1'>
                                        <button
                                          type='button'
                                          onClick={() => openEditLigne(ligne)}
                                          className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                                        >
                                          <EditOutlined /> Modifier
                                        </button>
                                        <button
                                          type='button'
                                          onClick={() => {
                                            setMenuLigneId(null);
                                            setLigneToDelete(ligne);
                                          }}
                                          className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10'
                                        >
                                          <DeleteOutlined /> Supprimer
                                        </button>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className='border-b transition-colors hover:bg-muted/50'>
                          <td colSpan={4} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                            Aucune ressource
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <DemandeTraitementsDetails demandeId={demande._id} />
              <HistoriqueDemande demandeId={demande._id} />
            </div>
          </div>

          <LigneFormDialog
            key={editingLigne ? editingLigne._id : "nouvelle-ligne"}
            open={ligneDialogOpen}
            onOpenChange={setLigneDialogOpen}
            demandeId={demande._id}
            ligne={editingLigne}
          />
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title='Supprimer la demande ?'
        description={
          <>
            Voulez-vous vraiment supprimer la demande{' '}
            <span className='font-medium text-foreground'>
              {demande?.numeroDemande}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={!!ligneToDelete}
        title='Supprimer la ressource ?'
        description={
          <>
            Voulez-vous vraiment supprimer cette ressource de la demande ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeletingLigne}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={handleDeleteLigne}
        onCancel={() => setLigneToDelete(null)}
      />
    </div>
  );
};

export default DemandeViewPage;