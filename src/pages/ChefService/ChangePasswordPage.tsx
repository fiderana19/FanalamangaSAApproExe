import React from 'react';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { useChangeMyPassword } from '@/hooks/useChangeMyPassword';
import { ChangeMyPasswordValidation } from '@/validation/changePassword.validation';
import { ChangeMyPasswordInterface } from '@/interfaces/User';
import PasswordField from '@/components/ui/PasswordField';
import { cardClassName } from '@/utils/ClassNames';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const profileUrl = '/chef_service/profil';

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ChangeMyPasswordInterface>({
    resolver: yupResolver(ChangeMyPasswordValidation),
  });

  const { mutateAsync: changeMyPassword, isPending: isChanging } =
    useChangeMyPassword({
      action() {
        reset();
        navigate(profileUrl);
      },
    });

  const handleChangePassword = async (data: ChangeMyPasswordInterface) => {
    await changeMyPassword(data);
  };

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex justify-center'>
        <div className='flex flex-col w-full max-w-md gap-5'>
          <div className='flex items-center justify-center gap-2'>
            <Lock className='w-5 h-5 text-brand' />
            <h2 className='text-lg font-bold'>Changer le mot de passe</h2>
          </div>

          <div className={`${cardClassName} w-full`}>
            <form onSubmit={handleSubmit(handleChangePassword)} className='space-y-4'>
              <div>
                <Controller
                  control={control}
                  name='ancienMotDePasse'
                  render={({ field: { value, onChange, onBlur } }) => (
                    <PasswordField
                      id='ancienMotDePasse'
                      label='Ancien mot de passe'
                      error={errors.ancienMotDePasse?.message}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name='nouveauMotDePasse'
                  render={({ field: { value, onChange, onBlur } }) => (
                    <PasswordField
                      id='nouveauMotDePasse'
                      label='Nouveau mot de passe'
                      error={errors.nouveauMotDePasse?.message}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name='confirmationMotDePasse'
                  render={({ field: { value, onChange, onBlur } }) => (
                    <PasswordField
                      id='confirmationMotDePasse'
                      label='Confirmation du nouveau mot de passe'
                      error={errors.confirmationMotDePasse?.message}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
              <Button
                variant='brand'
                className='w-full'
                type='submit'
                disabled={isChanging}
              >
                {isChanging ? <LoadingOutlined /> : <Lock className='w-4 h-4' />}
                Modifier le mot de passe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;