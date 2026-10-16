import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useGetLieux } from '@/hooks/useGetLieux';
import { usePatchService } from '@/hooks/usePatchService';
import { ManageServiceInterface, ServiceInterface } from '@/interfaces/Service';
import { ServiceValidation } from '@/validation/service.validation';
import { DIRECTIONS, getDirectionLabel } from '@/constants/Direction';
import { selectErrorClass } from '@/utils/ClassNames';

interface ServiceEditFormProps {
  service: ServiceInterface;
}

const ServiceEditForm: React.FC<ServiceEditFormProps> = ({ service }) => {
  const navigate = useNavigate();
  const { data: lieux } = useGetLieux();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManageServiceInterface>({
    resolver: yupResolver(ServiceValidation),
  });
  const { mutateAsync: updateService, isPending: isUpdating } = usePatchService({
    action() {
      navigate('/admin/service');
    },
  });

  const handleSave = async (values: ManageServiceInterface) => {
    try {
      await updateService({ id: service._id, data: values });
    } catch {
      return;
    }
  };

  return (
    <div className='panel w-full max-w-md p-6'>
      <div className='flex items-center gap-2.5 pb-2 mb-4'>
        <div className='grid place-items-center size-9 rounded bg-gray-100 text-gray-700'>
          <Building2 className='w-5 h-5' />
        </div>
        <h2 className='text-lg font-bold'>Modifier le service</h2>
      </div>
      <form onSubmit={handleSubmit(handleSave)} className='space-y-4'>
        <div>
          <Label htmlFor='sigleService' className='mb-1 block text-[13px] font-semibold'>
            Sigle du service
          </Label>
          <Controller
            control={control}
            name='sigleService'
            defaultValue={service.sigleService}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={selectErrorClass(!!errors.sigleService)}
              />
            )}
          />
          {errors.sigleService && (
            <div className='text-xs text-red-500 text-left w-full mt-1'>
              {errors.sigleService.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='nomService' className='mb-1 block text-[13px] font-semibold'>
            Nom du service
          </Label>
          <Controller
            control={control}
            name='nomService'
            defaultValue={service.nomService}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={selectErrorClass(!!errors.nomService)}
              />
            )}
          />
          {errors.nomService && (
            <div className='text-xs text-red-500 text-left w-full mt-1'>
              {errors.nomService.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='lieuService' className='mb-1 block text-[13px] font-semibold'>
            Lieu du service
          </Label>
          <Controller
            control={control}
            name='lieuService'
            defaultValue={service.lieuService}
            render={({ field: { value, onChange } }) => (
              <SearchableSelect
                value={value}
                onValueChange={onChange}
                options={lieux}
                placeholder='Sélectionner un lieu'
                allowCustom
                customLabel='Nouveau lieu'
                customPlaceholder='Saisir le nouveau lieu'
                className={
                  errors.lieuService
                    ? 'border-red-500 text-red-500'
                    : undefined
                }
              />
            )}
          />
          {errors.lieuService && (
            <div className='text-xs text-red-500 text-left w-full mt-1'>
              {errors.lieuService.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='direction' className='mb-1 block text-[13px] font-semibold'>
            Direction
          </Label>
          <Controller
            control={control}
            name='direction'
            defaultValue={service.direction}
            render={({ field: { value, onChange } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                  className={`w-full ${selectErrorClass(!!errors.direction)}`}
                >
                  <SelectValue placeholder='Sélectionner une direction' />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTIONS.map((direction) => (
                    <SelectItem key={direction} value={direction}>
                      {getDirectionLabel(direction)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.direction && (
            <div className='text-xs text-red-500 text-left w-full mt-1'>
              {errors.direction.message}
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

export default ServiceEditForm;