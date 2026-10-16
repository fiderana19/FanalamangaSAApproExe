import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Building2, EllipsisVertical, MapPin } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetService } from "@/hooks/useGetService";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useDeleteService } from "@/hooks/useDeleteService";
import { UserInterface } from "@/interfaces/User";
import { getDirectionLabel } from "@/constants/Direction";
import { getInitials } from "@/utils/User";
import { getResponsabiliteLabel } from "@/utils/Label";

const ServiceViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading, isError } = useGetService(id);
  const {
    data: allUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsers();
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const serviceUsers = useMemo(() => {
    if (!id) {
      return [];
    }
    return (allUsers ?? []).filter(
      (user: UserInterface) =>
        !!user.service &&
        typeof user.service === 'object' &&
        user.service._id === id,
    );
  }, [allUsers, id]);

  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService({
    action() {
      navigate("/admin/service");
    },
  });

  const handleDelete = async () => {
    if (!service) {
      return;
    }
    try {
      await deleteService(service._id);
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
      ) : isError || !service ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement du service.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <Building2 className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate'>
                {service.sigleService} - {service.nomService}
              </h1>
              <div className='flex items-center gap-2 text-sm text-brand-muted'>
                <MapPin className='w-4 h-4 shrink-0' />
                <span>{service.lieuService}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-brand-muted'>
                <Building2 className='w-4 h-4 shrink-0' />
                <span>{getDirectionLabel(service.direction)}</span>
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
                  onClick={() => navigate(`/admin/service/edit/${service._id}`)}
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
              Utilisateurs du service
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
                      Responsabilité
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
                  ) : serviceUsers.length === 0 ? (
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td
                        colSpan={4}
                        className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'
                      >
                        Aucun utilisateur dans ce service
                      </td>
                    </tr>
                  ) : (
                    serviceUsers.map((user: UserInterface) => (
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
                          {getResponsabiliteLabel(user.responsabilite)}
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
        title='Supprimer le service ?'
        description={
          <>
            Voulez-vous vraiment supprimer le service{" "}
            <span className='font-medium text-foreground'>
              {service?.sigleService}
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

export default ServiceViewPage;
