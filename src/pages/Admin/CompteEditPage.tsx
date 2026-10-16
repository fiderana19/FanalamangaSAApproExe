import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetUser } from '@/hooks/useGetUser';
import CompteEditForm from '@/components/admin/CompteEditForm';

const CompteEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useGetUser(id);

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex justify-center'>
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <LoadingOutlined className='text-4xl text-brand' />
          </div>
        ) : isError || !user ? (
          <div className='text-center text-red-500'>
            Une erreur est survenue lors du chargement du compte.
          </div>
        ) : (
          <CompteEditForm user={user} />
        )}
      </div>
    </div>
  );
};

export default CompteEditPage;