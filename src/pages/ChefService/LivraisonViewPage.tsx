import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { CircleX } from "lucide-react";
import { useParams } from "react-router-dom";
import LivraisonDetails from "@/components/livraison/LivraisonDetails";
import { useGetLivraison } from "@/hooks/useGetLivraison";

const LivraisonViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: livraison, isLoading, isError } = useGetLivraison(id);

  if (isLoading) {
    return (
      <div className='panel p-10 flex flex-col items-center justify-center gap-3'>
        <LoadingOutlined className='text-3xl text-brand' />
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  if (isError || !livraison) {
    return (
      <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
        <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
          <CircleX className='w-6 h-6' />
        </div>
        <p className='text-sm text-gray-600'>
          La récupération de la livraison a échoué.
        </p>
      </div>
    );
  }

  return <LivraisonDetails livraison={livraison} afficherBonReception />;
};

export default LivraisonViewPage;
