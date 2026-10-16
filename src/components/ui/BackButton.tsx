import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      aria-label='Retour'
      onClick={() => navigate(-1)}
      className='shrink-0'
    >
      <ArrowLeftOutlined />
    </Button>
  );
};

export default BackButton;