import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePatchDemande } from '@/hooks/usePatchDemande';
import { DemandeInterface, ManageDemandeInterface } from '@/interfaces/Demande';
import { DemandeValidation } from '@/validation/demande.validation';
import { selectErrorClass } from '@/utils/ClassNames';

interface DemandeEditFormProps {
  demande: DemandeInterface;
}

const DemandeEditForm: React.FC<DemandeEditFormProps> = ({ demande }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageDemandeInterface>({
    resolver: yupResolver(DemandeValidation),
  });
  const { mutateAsync: updateDemande, isPending: isUpdating } = usePatchDemande({
    action() {
      navigate(`/employe/demande/view/${demande._id}`);
    },
  });

  if (demande.statutActuelDemande !== "en_attente") {
    return (
      <div className='panel w-full max-w-md p-6 text-center'>
        <div className='text-sm text-brand-muted mb-4'>
          Cette demande ne peut plus être modifiée.
        </div>
        <Button type='button' variant='secondary' onClick={() => navigate(`/employe/demande/view/${demande._id}`)}>
          Retour à la demande
        </Button>
      </div>
    );
  }

  const handleSave = async (values: ManageDemandeInterface) => {
    try {
      const payload: ManageDemandeInterface = {
        motif: values.motif,
        urgence: !!values.urgence,
      };
      await updateDemande({ id: demande._id, data: payload });
    } catch {
      return;
    }
  };

  return (
    <div className='panel w-full max-w-md p-6'>
      <div className='flex items-center gap-2.5 pb-2 mb-4'>
        <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
          <ClipboardList className='w-5 h-5' />
        </div>
        <div className='min-w-0'>
          <h2 className='text-lg font-bold'>Modifier la demande</h2>
          <div className='text-xs text-brand-muted font-mono truncate'>
            {demande.numeroDemande}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
        <div>
          <Label htmlFor='motif' className='mb-1 block text-[13px] font-semibold'>
            Motif
          </Label>
          <Controller
            control={control}
            name='motif'
            defaultValue={demande.motif}
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
            defaultValue={demande.urgence}
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

        <Button type='submit' variant='brand' disabled={isUpdating} className='w-full'>
          {isUpdating ? <LoadingOutlined /> : null}
          Enregistrer
        </Button>
      </form>
    </div>
  );
};

export default DemandeEditForm;