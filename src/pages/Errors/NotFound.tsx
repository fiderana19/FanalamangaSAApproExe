import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-brand-bg'>
            <div className='text-5xl font-bold text-gray-500 mb-4'>404</div>
            <div className='text-xl text-gray-600 mb-8'>Page introuvable</div>
            <Link to="/">
                <Button variant={'secondary'}>Retour à la connexion</Button>
            </Link>
        </div>
    )
}

export default NotFound;