import { LoadingOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ForgotPasswordInterface } from '@/interfaces/User';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordValidation } from '@/validation/forgotPassword.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import FanalamangaLogo from '@/assets/image/fanalamanga-logo.png';
import Bg from '@/assets/image/background.jpg';
import { forgotPassword } from '@/api/users';
import { showToast } from '@/utils/Toast';
import { TOAST_TYPE } from '@/constants/ToastType';
import { HttpStatus } from '@/constants/Http_status';

const ForgotPasswordPage: React.FC = () => {
    const { handleSubmit, control, formState: { errors, isSubmitting, } } = useForm<ForgotPasswordInterface>({
        resolver: yupResolver(ForgotPasswordValidation)
    });
    const [isSent, setIsSent] = useState<boolean>(false);

    const handleForgotPassword = async (data: ForgotPasswordInterface) => {
        const response = await forgotPassword(data);
        if (response?.status === HttpStatus.OK || response?.status === HttpStatus.CREATED) {
            showToast({
                type: TOAST_TYPE.SUCCESS,
                message: (response?.data as { message?: string })?.message ?? 'Un nouveau mot de passe vous a été envoyé par email.'
            });
            setIsSent(true);
        }
    }

    return (
        <div className='min-h-screen grid place-items-center bg-cover bg-center p-4' style={{ backgroundImage: `url(${Bg})` }}>
            <div className='w-[400px] max-w-full bg-white rounded-lg shadow-lg px-8 py-8'>
                <div className='text-center mb-7'>
                    <img src={FanalamangaLogo} alt='Logo Fanalamanga SA' className='w-20 h-20 mx-auto object-contain drop-shadow-sm' />
                    <div className='text-gray-600 font-semibold text-md leading-snug mt-3 whitespace-nowrap'>
                        Fanalamanga SA — Approvisionnement
                    </div>
                </div>
                <h1 className='text-center text-[23px] font-bold mt-3 mb-0'>Mot de passe oublié</h1>
                <p className='text-center text-brand-muted text-sm mt-2 mb-6'>Entrez votre adresse email pour recevoir un nouveau mot de passe</p>
                {isSent ? (
                    <div className='text-center bg-green-50 border border-green-200 rounded-lg px-6 py-5'>
                        <p className='text-green-700 text-sm leading-relaxed'>
                            Un nouveau mot de passe vous a été envoyé par email.
                        </p>
                        <Link to='/' className='block mt-4 text-brand font-semibold text-sm hover:underline'>
                            Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(handleForgotPassword)}>
                        <div className='mb-2'>
                            <Label htmlFor='email' className='mb-1 block text-[13px] font-semibold'>Adresse email</Label>
                            <Controller
                                control={control}
                                name='email'
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <Input value={value} onChange={onChange} onBlur={onBlur} id='email' type='email' className={`${errors.email && 'border-red-500 text-red-500'} border-[#d9dee5]`} />
                                )}
                            />
                            {errors.email && <div className='text-xs text-red-500 text-left w-full mt-1'>{errors.email.message}</div>}
                        </div>
                        <Button variant={'brand'} size={'lg'} disabled={isSubmitting} className={`${isSubmitting && 'cursor-not-allowed'} w-full mt-1`} type='submit'>
                            {isSubmitting && <LoadingOutlined />} Réinitialiser le mot de passe
                        </Button>
                        <div className='text-center mt-4'>
                            <Link to='/' className='text-brand-muted text-sm hover:text-brand hover:underline'>
                                Retour à la connexion
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordPage;