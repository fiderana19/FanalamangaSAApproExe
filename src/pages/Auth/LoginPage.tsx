import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginInterface } from '@/interfaces/User';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginValidation } from '@/validation/login.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import FanalamangaLogo from '@/assets/image/fanalamanga-logo.png';
import Bg from '@/assets/image/background.jpg';

const LoginPage: React.FC = () => {
    const { handleSubmit: loginSubmit, control , formState: { errors, isSubmitting, },  } = useForm<LoginInterface>({
        resolver: yupResolver(LoginValidation)
    })
    const { login } = useAuth();
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const handleLoginUser = async (data: LoginInterface) => {
        await login(data);
    }

    const handlePasswordVisible = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className='min-h-screen grid place-items-center bg-cover bg-center p-4' style={{ backgroundImage: `url(${Bg})` }}>
            <div className='w-[380px] max-w-full bg-white rounded-lg shadow-lg px-8 py-8'>
                <div className='text-center mb-7'>
                    <img src={FanalamangaLogo} alt='Logo Fanalamanga SA' className='w-20 h-20 mx-auto object-contain drop-shadow-sm' />
                    <div className='text-gray-600 font-semibold text-md leading-snug mt-3 whitespace-nowrap'>
                        Fanalamanga SA — Approvisionnement
                    </div>
                </div>
                <h1 className='text-center text-[25px] font-bold mt-3 mb-0'>Content de vous revoir</h1>
                <p className='text-center text-brand-muted text-sm mt-2 mb-6'>Connectez-vous pour continuer</p>
                <form onSubmit={loginSubmit(handleLoginUser)}>
                    <div className='mb-2'>
                        <Label htmlFor='email' className='mb-1 block text-[13px] font-semibold'>Adresse email</Label>
                        <Controller 
                            control={control}
                            name='email'
                            render={({
                                field: { value, onChange, onBlur }
                            }) => (
                                <Input value={value} onChange={onChange} onBlur={onBlur} type='email' className={`${errors.email && 'border-red-500 text-red-500'} border-[#d9dee5]`} />
                            )}
                        />
                        {errors.email && <div className='text-xs text-red-500 text-left w-full mt-1'>{ errors.email.message }</div>}
                    </div>
                    <div className='mb-1'>
                        <Label htmlFor='motdepasse' className='mb-1 block text-[13px] font-semibold'>Mot de passe</Label>
                        <div className='relative'>
                            <Controller 
                                control={control}
                                name='motdepasse'
                                render={({
                                    field: { value, onChange, onBlur }
                                }) => (
                                    <Input value={value} onChange={onChange} onBlur={onBlur} type={isPasswordVisible ? 'text' : 'password'} className='border-[#d9dee5] pr-10' />
                                )}
                            />
                            {
                                isPasswordVisible ?
                                <EyeInvisibleOutlined 
                                    onClick={handlePasswordVisible}
                                    className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-500' />
                                : 
                                <EyeOutlined 
                                    onClick={handlePasswordVisible}
                                    className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-500' />
                            }
                        </div>
                        {errors.motdepasse && <div className='text-xs text-red-500 text-left w-full mt-1'>{ errors.motdepasse.message }</div>}
                    </div>
                    <div className='text-right mt-1 m1-3'>
                        <Link to='/forgot-password' className='text-brand-muted text-sm hover:text-brand hover:underline'>Mot de passe oublié ?</Link>
                    </div>
                    <Button variant={'brand'} size={'lg'} disabled={isSubmitting } className={`${isSubmitting && 'cursor-not-allowed'} w-full mt-2`} type='submit'>{ isSubmitting && <LoadingOutlined /> } Se connecter</Button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;