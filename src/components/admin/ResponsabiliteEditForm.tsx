import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePatchResponsabilite } from '@/hooks/usePatchResponsabilite';
import { ManageResponsabiliteInterface, ResponsabiliteInterface } from '@/interfaces/Responsabilite';
import { ResponsabiliteValidation } from '@/validation/responsabilite.validation';
import { selectErrorClass, textAreaBaseClass } from '@/utils/ClassNames';

interface ResponsabiliteEditFormProps {
  responsabilite: ResponsabiliteInterface;
}

const ResponsabiliteEditForm: React.FC<ResponsabiliteEditFormProps> = ({ responsabilite }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageResponsabiliteInterface>({
    resolver: yupResolver(ResponsabiliteValidation),
  });
  const { mutateAsync: updateResponsabilite, isPending: isUpdating } = usePatchResponsabilite({
    action() {
      navigate('/admin/responsabilite');
    },
  });

  const handleSave = async (values: ManageResponsabiliteInterface) => {
    try {
      await updateResponsabilite({ id: responsabilite._id, data: values });
    } catch {
      return;
    }
  };

  return (
    <div className='panel w-full max-w-md p-6'>
      <div className='flex items-center gap-2.5 pb-2 mb-4'>
        <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
          <Tag className='w-5 h-5' />
        </div>
        <h2 className='text-lg font-bold'>Modifier la responsabilité</h2>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
        <div>
          <Label htmlFor='libelle' className='mb-1 block text-[13px] font-semibold'>
            Libellé
          </Label>
          <Controller
            control={control}
            name='libelle'
            defaultValue={responsabilite.libelle}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={selectErrorClass(!!errors.libelle)}
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
            defaultValue={responsabilite.descriptionResponsabilite}
            render={({ field: { value, onChange, onBlur } }) => (
              <textarea
                value={value ?? ''}
                onChange={onChange}
                onBlur={onBlur}
                rows={4}
                className={`${textAreaBaseClass} ${selectErrorClass(!!errors.descriptionResponsabilite)}`}
              />
            )}
          />
          {errors.descriptionResponsabilite && (
            <div className='text-xs text-red-500 text-left w-full mt-1'>
              {errors.descriptionResponsabilite.message}
            </div>
          )}
        </div>

        <Button type='submit' variant='brand' disabled={isUpdating} className='w-full'>
          {isUpdating ? <LoadingOutlined /> : null}
          Enregistrer
        </Button>
      </form>
    </div>
  );
};

export default ResponsabiliteEditForm;