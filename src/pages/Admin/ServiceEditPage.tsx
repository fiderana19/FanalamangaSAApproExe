import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetService } from '@/hooks/useGetService';
import ServiceEditForm from '@/components/admin/ServiceEditForm';

const ServiceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading, isError } = useGetService(id);

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 flex items-center justify-center'>
        {isLoading ? (
          <LoadingOutlined className='text-4xl text-brand' />
        ) : isError || !service ? (
          <div className='text-center text-red-500'>
            Une erreur est survenue lors du chargement du service.
          </div>
        ) : (
          <ServiceEditForm service={service} />
        )}
      </div>
    </div>
  );
};

export default ServiceEditPage;