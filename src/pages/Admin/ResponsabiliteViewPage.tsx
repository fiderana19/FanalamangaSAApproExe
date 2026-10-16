import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { EllipsisVertical, Tag } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetResponsabilite } from "@/hooks/useGetResponsabilite";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useDeleteResponsabilite } from "@/hooks/useDeleteResponsabilite";
import { UserInterface } from "@/interfaces/User";
import { getInitials } from "@/utils/User";
import { getServiceLabel } from "@/utils/Label";

const ResponsabiliteViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: responsabilite, isLoading, isError } = useGetResponsabilite(id);
  const {
    data: allUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsers();
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const responsabiliteUsers = useMemo(() => {
    if (!id) {
      return [];
    }
    return (allUsers ?? []).filter(
      (user: UserInterface) =>
        !!user.responsabilite &&
        typeof user.responsabilite === "object" &&
        user.responsabilite._id === id,
    );
  }, [allUsers, id]);

  const { mutateAsync: deleteResponsabilite, isPending: isDeleting } = useDeleteResponsabilite({
    action() {
      navigate("/admin/responsabilite");
    },
  });

  const handleDelete = async () => {
    if (!responsabilite) {
      return;
    }
    try {
      await deleteResponsabilite(responsabilite._id);
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
      ) : isError || !responsabilite ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement de la responsabilité.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <Tag className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate'>{responsabilite.libelle}</h1>
              <div className='flex items-center gap-2 text-sm text-brand-muted'>
                <span>{responsabilite.descriptionResponsabilite || "Aucune description"}</span>
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
                  onClick={() => navigate(`/admin/responsabilite/edit/${responsabilite._id}`)}
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
            <h2 className='text-sm font-semibold mb-3 text-gray-700'>
              Utilisateurs avec cette responsabilité
            </h2>
            <div className='panel overflow-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-brand-bg'>
                  <tr className='border-b'>
                    <th className='pl-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>

                    </th>
                    <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>
                      Nom et prénoms
                    </th>
                    <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>
                      Adresse email
                    </th>
                    <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>
                      Service
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isUsersLoading ? (
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td
                        colSpan={4}
                        className='p-2 py-10 text-center align-middle whitespace-nowrap'
                      >
                        <LoadingOutlined className='text-2xl text-brand' />
                      </td>
                    </tr>
                  ) : isUsersError ? (
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td
                        colSpan={4}
                        className='p-2 py-10 text-center align-middle whitespace-nowrap text-red-500'
                      >
                        Une erreur est survenue lors du chargement des
                        utilisateurs.
                      </td>
                    </tr>
                  ) : responsabiliteUsers.length === 0 ? (
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td
                        colSpan={4}
                        className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'
                      >
                        Aucun utilisateur avec cette responsabilité
                      </td>
                    </tr>
                  ) : (
                    responsabiliteUsers.map((user: UserInterface) => (
                      <tr
                        key={user._id}
                        onClick={() =>
                          navigate(`/admin/compte/view/${user._id}`)
                        }
                        className='border-b transition-colors hover:bg-muted/50 cursor-pointer'
                      >
                        <td className='pl-3 py-2'>
                          <div className='grid place-items-center size-9 rounded-full bg-brand/10 text-brand text-xs font-semibold'>
                            {getInitials(user.nom, user.prenom)}
                          </div>
                        </td>
                        <td className='px-3 py-2 font-medium'>
                          {[user.nom?.toUpperCase(), user.prenom].filter(Boolean).join(' ')}
                        </td>
                        <td className='px-3 py-2 text-brand-muted'>
                          {user.email}
                        </td>
                        <td className='px-3 py-2'>
                          {getServiceLabel(user.service)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title='Supprimer la responsabilité ?'
        description={
          <>
            Voulez-vous vraiment supprimer la responsabilité{" "}
            <span className='font-medium text-foreground'>
              {responsabilite?.libelle}
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

export default ResponsabiliteViewPage;