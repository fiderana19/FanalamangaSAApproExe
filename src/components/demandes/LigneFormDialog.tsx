import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useGetRessources } from "@/hooks/useGetRessources";
import { useCreateLigne } from "@/hooks/useCreateLigne";
import { usePatchLigne } from "@/hooks/usePatchLigne";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { RessourceInterface } from "@/interfaces/Ressource";
import {
  LigneDemandeInterface,
  ManageLigneDemandeInterface,
  RessourceRef,
} from "@/interfaces/Demande";
import { LigneValidation } from "@/validation/demande.validation";

const getRessource = (ressource: RessourceRef | string | null): RessourceRef | null =>
  ressource && typeof ressource === "object" ? ressource : null;

const selectErrorClass = (hasError: boolean) =>
  hasError
    ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
    : 'border-[#d9dee5]';

interface LigneFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demandeId: string;
  ligne?: LigneDemandeInterface | null;
  onSaved?: (ligne: LigneDemandeInterface) => void;
}

const LigneFormDialog: React.FC<LigneFormDialogProps> = ({
  open,
  onOpenChange,
  demandeId,
  ligne,
  onSaved,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ManageLigneDemandeInterface>({
    resolver: yupResolver(LigneValidation),
    defaultValues: {
      ressource: ligne ? (getRessource(ligne.ressource)?._id ?? "") : "",
      quantite: ligne ? ligne.quantite : 1,
    },
  });
  const { data: ressources, isLoading: isLoadingRessources } = useGetRessources();
  const { mutateAsync: createLigne, isPending: isCreating } = useCreateLigne();
  const { mutateAsync: updateLigne, isPending: isUpdating } = usePatchLigne();

  useEffect(() => {
    if (open) {
      reset({
        ressource: ligne ? (getRessource(ligne.ressource)?._id ?? "") : "",
        quantite: ligne ? ligne.quantite : 1,
      });
    }
  }, [open, ligne, reset]);

  const ressourceOptions = (ressources ?? []).map((ressource: any) => ({
    value: ressource._id,
    label: `${ressource.reference} - ${ressource.designationRessource}`,
  }));

  const handleSave = async (values: ManageLigneDemandeInterface) => {
    try {
      let result;
      if (ligne) {
        result = await updateLigne({ demandeId, ligneId: ligne._id, data: values });
      } else {
        result = await createLigne({ demandeId, data: values });
      }
      onSaved?.(result?.data);
      onOpenChange(false);
    } catch {
      return;
    }
  };

  const isPending = isCreating || isUpdating;

  const selectedRessourceId = useWatch({ control, name: "ressource" });
  const selectedRessource = (ressources ?? []).find(
    (ressource: RessourceInterface) => ressource._id === selectedRessourceId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{ligne ? "Modifier la ressource" : "Ajouter une ressource"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
          <div>
            <Label className='mb-1 block text-[13px] font-semibold'>Ressource</Label>
            <Controller
              control={control}
              name='ressource'
              render={({ field: { value, onChange } }) => (
                <SearchableSelect
                  value={value}
                  options={ressourceOptions}
                  onValueChange={onChange}
                  placeholder={isLoadingRessources ? "Chargement des ressources…" : "Sélectionner une ressource"}
                  emptyMessage="Aucune ressource trouvée"
                  className={selectErrorClass(!!errors.ressource)}
                />
              )}
            />
            {errors.ressource && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.ressource.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='quantite' className='mb-1 block text-[13px] font-semibold'>
              Quantité
            </Label>
            <Controller
              control={control}
              name='quantite'
              render={({ field: { value, onChange } }) => (
                <Input
                  type='number'
                  min={1}
                  value={value ?? ""}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className={selectErrorClass(!!errors.quantite)}
                />
              )}
            />
            {errors.quantite && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.quantite.message}
              </div>
            )}
          </div>

          {selectedRessource && (
            <div className='flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2'>
              <span className='text-sm text-muted-foreground'>Unité :</span>
              <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'>
                {getUniteLabel(selectedRessource.unite)}
              </span>
            </div>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type='submit' variant='brand' disabled={isPending}>
              {isPending ? <LoadingOutlined /> : null}
              {ligne ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LigneFormDialog;