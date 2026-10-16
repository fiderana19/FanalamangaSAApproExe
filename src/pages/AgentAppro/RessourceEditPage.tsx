import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetRessource } from '@/hooks/useGetRessource';
import RessourceEditForm from '@/components/ressources/RessourceEditForm';

const RessourceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ressource, isLoading, isError } = useGetRessource(id);

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex items-center justify-center'>
        {isLoading ? (
          <LoadingOutlined className='text-4xl text-brand' />
        ) : isError || !ressource ? (
          <div className='text-center text-red-500'>
            Une erreur est survenue lors du chargement de la ressource.
          </div>
        ) : (
          <RessourceEditForm ressource={ressource} />
        )}
      </div>
    </div>
  );
};

export default RessourceEditPage;