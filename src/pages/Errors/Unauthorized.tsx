import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-brand-bg'>
            <div className='text-5xl font-bold text-red-500 mb-4'>403</div>
            <div className='text-xl text-gray-600 mb-8'>Vous n'avez pas accès à cette page</div>
            <Link to="/">
                <Button variant={'secondary'}>Retour à la connexion</Button>
            </Link>
        </div>
    )
}

export default Unauthorized;