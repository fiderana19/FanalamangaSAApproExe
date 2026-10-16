import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetDemande } from '@/hooks/useGetDemande';
import DemandeEditForm from '@/components/demandes/DemandeEditForm';

const DemandeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError } = useGetDemande(id);

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex items-center justify-center'>
        {isLoading ? (
          <LoadingOutlined className='text-4xl text-brand' />
        ) : isError || !demande ? (
          <div className='text-center text-red-500'>
            Une erreur est survenue lors du chargement de la demande.
          </div>
        ) : (
          <DemandeEditForm demande={demande} />
        )}
      </div>
    </div>
  );
};

export default DemandeEditPage;