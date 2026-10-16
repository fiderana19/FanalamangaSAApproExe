import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateResponsabilite } from '@/hooks/useCreateResponsabilite';
import { ManageResponsabiliteInterface } from '@/interfaces/Responsabilite';
import { ResponsabiliteValidation } from '@/validation/responsabilite.validation';
import { textAreaBaseClass } from '@/utils/ClassNames';

const ResponsabiliteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageResponsabiliteInterface>({
    resolver: yupResolver(ResponsabiliteValidation),
  });
  const { mutateAsync: createResponsabilite, isPending: isCreating } = useCreateResponsabilite({
    action() {
      navigate('/admin/responsabilite');
    },
  });

  const handleSave = async (values: ManageResponsabiliteInterface) => {
    try {
      await createResponsabilite(values);
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
              <Tag className='w-5 h-5' />
            </div>
            <h2 className='text-lg font-bold'>Nouvelle responsabilité</h2>
          </div>
          <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
            <div>
              <Label htmlFor='libelle' className='mb-1 block text-[13px] font-semibold'>
                Libellé
              </Label>
              <Controller
                control={control}
                name='libelle'
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={
                      errors.libelle
                        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                        : 'border-[#d9dee5]'
                    }
                  />
                )}
              />
              {errors.libelle && (
                <div className='text-xs text-red-500 text-left w-full mt-1'>
                  {errors.libelle.message}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor='descriptionResponsabilite' className='mb-1 block text-[13px] font-semibold'>
                Description
              </Label>
              <Controller
                control={control}
                name='descriptionResponsabilite'
                render={({ field: { value, onChange, onBlur } }) => (
                  <textarea
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={4}
                    className={`${textAreaBaseClass} ${
                      errors.descriptionResponsabilite
                        ? 'border-red-500 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                        : 'border-[#d9dee5]'
                    }`}
                  />
                )}
              />
              {errors.descriptionResponsabilite && (
                <div className='text-xs text-red-500 text-left w-full mt-1'>
                  {errors.descriptionResponsabilite.message}
                </div>
              )}
            </div>

            <Button type='submit' variant='brand' disabled={isCreating} className='w-full'>
              {isCreating ? <LoadingOutlined /> : null}
              Créer la responsabilité
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResponsabiliteCreatePage;