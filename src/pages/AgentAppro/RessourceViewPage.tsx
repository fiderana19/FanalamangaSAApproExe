import React from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Boxes, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetRessource } from "@/hooks/useGetRessource";
import { useDeleteRessource } from "@/hooks/useDeleteRessource";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";

const RessourceViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: ressource, isLoading, isError } = useGetRessource(id);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const { mutateAsync: deleteRessource, isPending: isDeleting } = useDeleteRessource({
    action() {
      navigate("/agent_appro/ressource");
    },
  });

  const handleDelete = async () => {
    if (!ressource) {
      return;
    }
    try {
      await deleteRessource(ressource._id);
    } catch {
      return;
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className='flex flex-col'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !ressource ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement de la ressource.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <Boxes className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate'>
                {ressource.reference} - {ressource.designationRessource}
              </h1>
              <div className='flex items-center gap-2 flex-wrap'>
                <RessourceCategorieBadge categorie={ressource.categorie} size='md' />
                <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'>
                  Unité : {getUniteLabel(ressource.unite)}
                </span>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Actions'
                  className='shrink-0 text-gray-500 hover:text-brand hover:bg-[#e9f5ee]'
                >
                  <EllipsisVertical />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-52 p-1'>
                <button
                  type='button'
                  onClick={() => navigate(`/agent_appro/ressource/edit/${ressource._id}`)}
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                >
                  <EditOutlined /> Modifier
                </button>
                <button
                  type='button'
                  onClick={() => setConfirmOpen(true)}
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10'
                >
                  <DeleteOutlined /> Supprimer
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <div className='w-full mt-5'>
            <div className='panel p-5'>
              <h2 className='text-sm font-semibold mb-3 text-gray-700'>
                Description
              </h2>
              <p className='text-sm text-gray-600 leading-relaxed'>
                {ressource.ressourceDescription}
              </p>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title='Supprimer la ressource ?'
        description={
          <>
            Voulez-vous vraiment supprimer la ressource{" "}
            <span className='font-medium text-foreground'>
              {ressource?.designationRessource}
            </span>{" "}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default RessourceViewPage;