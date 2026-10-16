import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateRessource } from '@/hooks/useCreateRessource';
import { ManageRessourceInterface } from '@/interfaces/Ressource';
import { RessourceValidation } from '@/validation/ressource.validation';
import { CATEGORIES, getCategorieLabel, getCategorieMeta } from '@/constants/RessourceCategorie';
import { UNITES, getUniteLabel } from '@/constants/RessourceUnite';
import { selectErrorClass } from '@/utils/ClassNames';

const RessourceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageRessourceInterface>({
    resolver: yupResolver(RessourceValidation),
  });
  const { mutateAsync: createRessource, isPending: isCreating } = useCreateRessource({
    action() {
      navigate('/agent_appro/ressource');
    },
  });

  const handleSave = async (values: ManageRessourceInterface) => {
    try {
      await createRessource(values);
    } catch {
      return;
    }
  };

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex items-center justify-center'>
        <div className='panel w-full max-w-md p-6'>
          <div className='flex items-center gap-2.5 pb-2 mb-4'>
            <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
              <Boxes className='w-5 h-5' />
            </div>
            <h2 className='text-lg font-bold'>Nouvelle ressource</h2>
          </div>
          <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
          <div>
            <Label htmlFor='reference' className='mb-1 block text-[13px] font-semibold'>
              Référence
            </Label>
            <Controller
              control={control}
              name='reference'
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className={selectErrorClass(!!errors.reference)}
                />
              )}
            />
            {errors.reference && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.reference.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='designationRessource' className='mb-1 block text-[13px] font-semibold'>
              Désignation
            </Label>
            <Controller
              control={control}
              name='designationRessource'
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className={selectErrorClass(!!errors.designationRessource)}
                />
              )}
            />
            {errors.designationRessource && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.designationRessource.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='ressourceDescription' className='mb-1 block text-[13px] font-semibold'>
              Description
            </Label>
            <Controller
              control={control}
              name='ressourceDescription'
              render={({ field: { value, onChange, onBlur } }) => (
                <Textarea
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  rows={3}
                  className={selectErrorClass(!!errors.ressourceDescription)}
                />
              )}
            />
            {errors.ressourceDescription && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.ressourceDescription.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='unite' className='mb-1 block text-[13px] font-semibold'>
              Unité
            </Label>
            <Controller
              control={control}
              name='unite'
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className={`w-full ${selectErrorClass(!!errors.unite)}`}>
                    <SelectValue placeholder='Sélectionner une unité' />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITES.map((unite) => (
                      <SelectItem key={unite} value={unite}>
                        {getUniteLabel(unite)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unite && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.unite.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='categorie' className='mb-1 block text-[13px] font-semibold'>
              Catégorie
            </Label>
            <Controller
              control={control}
              name='categorie'
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className={`w-full ${selectErrorClass(!!errors.categorie)}`}>
                    <SelectValue placeholder='Sélectionner une catégorie' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((categorie) => {
                      const meta = getCategorieMeta(categorie);
                      const Icon = meta.icon;
                      return (
                        <SelectItem key={categorie} value={categorie}>
                          <span className='flex items-center gap-2'>
                            <span className={`size-2 rounded-full ${meta.dot}`} />
                            <Icon className='size-3.5 text-muted-foreground' />
                            {getCategorieLabel(categorie)}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categorie && (
              <div className='text-xs text-red-500 text-left w-full mt-1'>
                {errors.categorie.message}
              </div>
            )}
          </div>

          <Button type='submit' variant='brand' disabled={isCreating} className='w-full'>
            {isCreating ? <LoadingOutlined /> : null}
            Créer la ressource
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default RessourceCreatePage;