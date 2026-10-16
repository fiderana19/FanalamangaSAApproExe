import React, { useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Check, ClipboardList, EllipsisVertical } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import RessourceCategorieBadge from '@/components/ressources/RessourceCategorieBadge';
import LigneStatutBadge from '@/components/status/LigneStatutBadge';
import LigneFormDialog from '@/components/demandes/LigneFormDialog';
import { getUniteLabel } from '@/constants/RessourceUnite';
import { pluriel } from '@/utils/Pluriel';
import { useCreateDemande } from '@/hooks/useCreateDemande';
import { usePatchDemande } from '@/hooks/usePatchDemande';
import { useDeleteLigne } from '@/hooks/useDeleteLigne';
import {
  DemandeInterface,
  LigneDemandeInterface,
  ManageDemandeInterface,
} from '@/interfaces/Demande';
import { DemandeValidation } from '@/validation/demande.validation';
import { selectErrorClass } from '@/utils/ClassNames';
import { getRessource } from '@/utils/Ressource';

const ETAPES = ["Demande d'approvisionnement", "Ressource de la demande"];

const DemandeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [etape, setEtape] = useState<1 | 2>(1);
  const [demande, setDemande] = useState<DemandeInterface | null>(null);
  const [lignes, setLignes] = useState<LigneDemandeInterface[]>([]);
  const [ligneDialogOpen, setLigneDialogOpen] = useState<boolean>(false);
  const [editingLigne, setEditingLigne] = useState<LigneDemandeInterface | null>(null);
  const [ligneToDelete, setLigneToDelete] = useState<LigneDemandeInterface | null>(null);
  const [menuLigneId, setMenuLigneId] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageDemandeInterface>({
    resolver: yupResolver(DemandeValidation),
    defaultValues: {
      motif: "",
      urgence: false,
    },
  });

  const { mutateAsync: createDemande, isPending: isCreating } = useCreateDemande();
  const { mutateAsync: updateDemande, isPending: isUpdating } = usePatchDemande();
  const { mutateAsync: deleteLigne, isPending: isDeletingLigne } = useDeleteLigne();

  const handleStep1 = async (values: ManageDemandeInterface) => {
    try {
      const payload: ManageDemandeInterface = {
        motif: values.motif,
        urgence: !!values.urgence,
      };
      if (demande) {
        await updateDemande({ id: demande._id, data: payload });
      } else {
        const result = await createDemande(payload);
        setDemande(result?.data ?? null);
      }
      setEtape(2);
    } catch {
      return;
    }
  };

  const handleLigneSaved = (ligne: LigneDemandeInterface) => {
    setLignes((prev) => {
      const index = prev.findIndex((l) => l._id === ligne._id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = ligne;
        return next;
      }
      return [...prev, ligne];
    });
  };

  const handleDeleteLigne = async () => {
    if (!demande || !ligneToDelete) {
      return;
    }
    try {
      await deleteLigne({ demandeId: demande._id, ligneId: ligneToDelete._id });
      setLignes((prev) => prev.filter((l) => l._id !== ligneToDelete._id));
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

  const handleTerminer = () => {
    if (demande) {
      navigate(`/employe/demande/view/${demande._id}`);
    }
  };

  return (
    <div className='flex flex-col min-h-[70vh]'>
      <div className='flex justify-center w-full mb-6'>
      <ol className='inline-flex items-center gap-3'>
        {ETAPES.map((label, index) => {
          const num = index + 1;
          const active = etape === num;
          const done = etape > num;
          return (
            <li key={label} className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <span
                  className={`grid place-items-center size-8 rounded-full text-sm font-bold shrink-0 ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-[#1f6a45] text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {done ? <Check className='w-4 h-4' /> : num}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    active
                      ? 'font-semibold text-[#1f6a45]'
                      : done
                        ? 'text-gray-600'
                        : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < ETAPES.length - 1 && (
                <span className={`h-px w-12 ${done || active ? 'bg-[#1f6a45]' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
      </div>

      <div className={`flex-1 flex items-center justify-center ${etape === 1 ? '' : 'hidden'}`}>
        <div className='panel w-full max-w-md p-6'>
          <div className='flex items-center gap-2.5 pb-2 mb-4'>
            <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
              <ClipboardList className='w-5 h-5' />
            </div>
            <h2 className='text-lg font-bold'>Demande d'approvisionnement</h2>
          </div>
          <form onSubmit={handleSubmit(handleStep1)} className='space-y-4'>
            <div>
              <Label htmlFor='motif' className='mb-1 block text-[13px] font-semibold'>
                Motif
              </Label>
              <Controller
                control={control}
                name='motif'
                render={({ field: { value, onChange, onBlur } }) => (
                  <Textarea
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={3}
                    className={selectErrorClass(!!errors.motif)}
                  />
                )}
              />
              {errors.motif && (
                <div className='text-xs text-red-500 text-left w-full mt-1'>
                  {errors.motif.message}
                </div>
              )}
            </div>

            <div>
              <Controller
                control={control}
                name='urgence'
                render={({ field: { value, onChange } }) => (
                  <label className='flex items-center justify-end gap-2.5 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={!!value}
                      onChange={(e) => onChange(e.target.checked)}
                      className='size-4 accent-green-600 border rounded-md'
                    />
                    <span className='text-sm text-gray-700'>Urgent</span>
                  </label>
                )}
              />
            </div>

            <Button
              type='submit'
              variant='brand'
              disabled={isCreating || isUpdating}
              className='w-full'
            >
              {isCreating || isUpdating ? <LoadingOutlined /> : null}
              Suivant
            </Button>
          </form>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${etape === 2 ? '' : 'hidden'}`}>
        <div className='panel flex flex-col overflow-hidden rounded-lg'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
            <div>
              <h2 className='text-sm font-semibold text-gray-700'>
                {pluriel(lignes.length, "Ressource de la demande", "Ressources de la demande")}{' '}
                {lignes.length > 0 && (
                  <span className='ml-1 text-muted-foreground font-normal'>({lignes.length})</span>
                )}
              </h2>
              <div className='text-xs text-brand-muted font-mono'>
                {demande?.numeroDemande}
              </div>
            </div>
            <Button variant='brand' onClick={openCreateLigne} className='shrink-0'>
              <PlusOutlined /> Ajouter une ressource
            </Button>
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
                {lignes.length > 0 ? (
                  lignes.map((ligne: LigneDemandeInterface) => {
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

        <div className='flex items-center justify-end gap-3 mt-5'>
          <Button type='button' variant='outline' onClick={() => setEtape(1)}>
            Précédent
          </Button>
          <Button type='button' variant='brand' onClick={handleTerminer}>
            Terminer
          </Button>
        </div>
      </div>

      <LigneFormDialog
        key={editingLigne ? editingLigne._id : "nouvelle-ligne"}
        open={ligneDialogOpen}
        onOpenChange={setLigneDialogOpen}
        demandeId={demande?._id ?? ""}
        ligne={editingLigne}
        onSaved={handleLigneSaved}
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

export default DemandeCreatePage;