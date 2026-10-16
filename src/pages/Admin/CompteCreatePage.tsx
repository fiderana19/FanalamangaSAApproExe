import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Building2, Info, Lock, Tag, User, Users } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useGetServices } from '@/hooks/useGetServices';
import { useGetResponsabilites } from '@/hooks/useGetResponsabilites';
import { CreateUserInterface } from '@/interfaces/User';
import { CreateUserValidation } from '@/validation/createUser.validation';
import { getRoleLabel, NON_ADMIN_ROLES } from '@/constants/Role';
import { handlePhoneKeyDown, sanitizePhone } from '@/utils/Phone';
import { generatePassword } from '@/utils/Password';
import { cardClassName, selectErrorClass, selectErrorClassFocus } from '@/utils/ClassNames';
import SectionHeader from '@/components/ui/SectionHeader';

const CompteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserInterface>({
    resolver: yupResolver(CreateUserValidation),
    defaultValues: {
      motdepasse: generatePassword(),
      estActive: true,
      role: "employe",
      service: null,
      responsabilite: null,
    },
  });
  const { data: services } = useGetServices();
  const { data: responsabilites } = useGetResponsabilites();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser({
    action() {
      navigate('/admin/compte');
    },
  });

  const handleSave = async (values: CreateUserInterface) => {
    try {
      await createUser(values);
    } catch {
      return;
    }
  };

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex justify-center'>
        <div className='flex flex-col w-full max-w-md gap-5'>
          <div className='flex items-center justify-center gap-2'>
            <Users className='w-5 h-5 text-brand' />
            <h2 className='text-lg font-bold'>Nouveau compte</h2>
          </div>
          <form onSubmit={handleSubmit(handleSave)} className='flex flex-col gap-5'>
            <div className={cardClassName}>
              <SectionHeader icon={<User className='w-4 h-4' />} title='Informations personnelles' />
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='nom' className='mb-1 block text-[13px] font-semibold'>
                    Nom
                  </Label>
                  <Controller
                    control={control}
                    name='nom'
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={selectErrorClass(!!errors.nom)}
                      />
                    )}
                  />
                  {errors.nom && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.nom.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor='prenom' className='mb-1 block text-[13px] font-semibold'>
                    Prénom(s) <span className='font-normal text-brand-muted'>(optionnel)</span>
                  </Label>
                  <Controller
                    control={control}
                    name='prenom'
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={selectErrorClass(!!errors.prenom)}
                      />
                    )}
                  />
                  {errors.prenom && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.prenom.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor='email' className='mb-1 block text-[13px] font-semibold'>
                    Adresse email
                  </Label>
                  <Controller
                    control={control}
                    name='email'
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        type='email'
                        className={selectErrorClass(!!errors.email)}
                      />
                    )}
                  />
                  {errors.email && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor='telephone' className='mb-1 block text-[13px] font-semibold'>
                    Téléphone
                  </Label>
                  <Controller
                    control={control}
                    name='telephone'
                    render={({ field: { value, onChange, onBlur } }) => (
                      <div className='relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-muted select-none pointer-events-none'>
                          +261
                        </span>
                        <Input
                          value={value}
                          onChange={(e) => onChange(sanitizePhone(e.target.value))}
                          onBlur={onBlur}
                          onKeyDown={handlePhoneKeyDown}
                          inputMode='numeric'
                          className={`${selectErrorClass(!!errors.telephone)} pl-12`}
                        />
                      </div>
                    )}
                  />
                  {errors.telephone && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.telephone.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor='role' className='mb-1 block text-[13px] font-semibold'>
                    Rôle
                  </Label>
                  <Controller
                    control={control}
                    name='role'
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className={`w-full ${selectErrorClassFocus(!!errors.role)}`}>
                          <SelectValue placeholder='Sélectionner un rôle' />
                        </SelectTrigger>
                        <SelectContent>
                          {NON_ADMIN_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {getRoleLabel(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.role.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cardClassName}>
              <SectionHeader icon={<Building2 className='w-4 h-4' />} title='Service de l’utilisateur' />
              <div>
                <Label htmlFor='service' className='mb-1 block text-[13px] font-semibold'>
                  Service
                </Label>
                <Controller
                  control={control}
                  name='service'
                  render={({ field: { value, onChange } }) => (
                    <SearchableSelect
                      value={value ?? null}
                      onValueChange={onChange}
                      options={[
                        ...(services?.map((service: any) => ({
                          value: service._id,
                          label: service.nomService || service.sigleService,
                        })) ?? []),
                      ]}
                      placeholder='Sélectionner un service'
                      createLabel='Créer un nouveau service'
                      onCreate={() => navigate('/admin/service/create')}
                      className={
                        errors.service ? 'border-red-500 text-red-500' : undefined
                      }
                    />
                  )}
                />
                {errors.service && (
                  <div className='text-xs text-red-500 text-left w-full mt-1'>
                    {errors.service.message}
                  </div>
                )}
              </div>
            </div>

            <div className={cardClassName}>
              <SectionHeader icon={<Tag className='w-4 h-4' />} title='Responsabilité' />
              <div>
                <Label htmlFor='responsabilite' className='mb-1 block text-[13px] font-semibold'>
                  Responsabilité
                </Label>
                <Controller
                  control={control}
                  name='responsabilite'
                  render={({ field: { value, onChange } }) => (
                    <SearchableSelect
                      value={value ?? null}
                      onValueChange={onChange}
                      options={[
                        ...(responsabilites?.map((resp: any) => ({
                          value: resp._id,
                          label: resp.libelle,
                        })) ?? []),
                      ]}
                      placeholder='Sélectionner une responsabilité'
                      createLabel='Créer une nouvelle responsabilité'
                      onCreate={() => navigate('/admin/responsabilite/create')}
                      className={
                        errors.responsabilite
                          ? 'border-red-500 text-red-500'
                          : undefined
                      }
                    />
                  )}
                />
                {errors.responsabilite && (
                  <div className='text-xs text-red-500 text-left w-full mt-1'>
                    {errors.responsabilite.message}
                  </div>
                )}
              </div>
            </div>

            <div className={cardClassName}>
              <SectionHeader icon={<Lock className='w-4 h-4' />} title='Sécurité' />
              <div className='space-y-4'>
                <div className='flex justify-end'>
                  <Controller
                    control={control}
                    name='estActive'
                    render={({ field: { value, onChange } }) => (
                      <label className='flex items-center gap-2 cursor-pointer text-[13px] font-semibold select-none'>
                        <input
                          type='checkbox'
                          checked={!!value}
                          onChange={(e) => onChange(e.target.checked)}
                          className='size-4 accent-brand cursor-pointer'
                        />
                        Compte actif
                      </label>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor='motdepasse' className='mb-1 block text-[13px] font-semibold'>
                    Mot de passe par défaut
                  </Label>
                  <Controller
                    control={control}
                    name='motdepasse'
                    render={({ field: { value, onBlur } }) => (
                      <Input
                        value={value}
                        onBlur={onBlur}
                        readOnly
                        type='password'
                        className={`${selectErrorClass(!!errors.motdepasse)} cursor-not-allowed bg-gray-50`}
                      />
                    )}
                  />
                  {errors.motdepasse && (
                    <div className='text-xs text-red-500 text-left w-full mt-1'>
                      {errors.motdepasse.message}
                    </div>
                  )}
                  <div className='flex items-center gap-1.5 mt-2 text-xs text-brand-muted'>
                    <Info className='w-3.5 h-3.5' />
                    <span>Mot de passe généré automatiquement</span>
                  </div>
                </div>
              </div>
            </div>

            <Button type='submit' variant='brand' disabled={isCreating} className='w-full'>
              {isCreating ? <LoadingOutlined /> : null}
              Créer le compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompteCreatePage;