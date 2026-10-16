import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight, EllipsisVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetServices } from "@/hooks/useGetServices";
import { useGetLieux } from "@/hooks/useGetLieux";
import { useDeleteService } from "@/hooks/useDeleteService";
import { useGetUsers } from "@/hooks/useGetUsers";
import { ServiceInterface } from "@/interfaces/Service";
import { DIRECTIONS, getDirectionLabel } from "@/constants/Direction";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuServiceId, setMenuServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [directionFilterRef, setDirectionFilterRef] = useState<boolean>(false);
  const [directionFilterText, setDirectionFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: services, isLoading, isError, refetch } = useGetServices();
  const { data: lieux } = useGetLieux();
  const { data: users } = useGetUsers();
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService();

  useEffect(() => {
    refetchData();
  }, []);

  async function refetchData() {
    refetch();
  }

  const filterServices = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const filterByDirection = (filter: string) => {
    setDirectionFilterRef(true);
    setDirectionFilterText(filter);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRef, filterText, directionFilterRef, directionFilterText]);

  const matchesSearch = (service: any) =>
    !searchTerm.trim() ||
    [service.sigleService, service.nomService, service.lieuService, service.direction]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredServices = (
    filterRef
      ? (services ?? []).filter((service: any) => service.lieuService === filterText)
      : services ?? []
  )
    .filter((service: any) =>
      directionFilterRef ? service.direction === directionFilterText : true,
    )
    .filter(matchesSearch);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = filteredServices.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount = filteredServices.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, filteredServices.length);

  const openEdit = (service: ServiceInterface) => {
    navigate(`/admin/service/edit/${service._id}`);
  };

  const openView = (service: ServiceInterface) => {
    navigate(`/admin/service/view/${service._id}`);
  };

  const getUserCount = (service: ServiceInterface) =>
    (users ?? []).filter((user: any) => user.service?._id === service._id)
      .length;

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
    } catch {
      return;
    } finally {
      setServiceToDelete(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
        pages.push(i);
      }
    }
    const items: Array<number | "..."> = [];
    let prev = 0;
    for (const p of pages) {
      if (p - prev > 1) items.push("...");
      items.push(p);
      prev = p;
    }
    return items;
  };

  return (
    <>
      <div className='flex items-center gap-3 mb-5'>
        <div className='relative shrink-0'>
          <SearchOutlined className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Recherche par nom'
            className='w-64 border-[#d9dee5] pl-9'
          />
        </div>
        <div className='ml-auto flex items-center gap-3'>
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterServices(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className='w-44 shrink-0 border-[#d9dee5]'>
              <Filter className='size-4 text-muted-foreground' />
              <SelectValue placeholder='Filtrer par lieu' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les lieux</SelectItem>
              {lieux.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={directionFilterRef ? directionFilterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterByDirection(value) : setDirectionFilterRef(false)
            }
          >
            <SelectTrigger className='w-44 shrink-0 border-[#d9dee5]'>
              <Filter className='size-4 text-muted-foreground' />
              <SelectValue placeholder='Filtrer par direction' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Toutes les directions</SelectItem>
              {DIRECTIONS.map((direction) => (
                <SelectItem key={direction} value={direction}>
                  {getDirectionLabel(direction)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant='brand' onClick={() => navigate('/admin/service/create')} className='shrink-0'>
            <PlusOutlined /> Nouveau service
          </Button>
        </div>
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-brand-bg'>
            <tr className='border-b'>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Sigle</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Nom du service</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Lieu</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Direction</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Utilisateurs</th>
              <th className='py-2 text-right align-middle font-medium whitespace-nowrap text-muted-foreground'></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap'>
                  <LoadingOutlined className='text-2xl text-brand' />
                </td>
              </tr>
            ) : isError ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-red-500'>
                  Une erreur est survenue lors du chargement des services.
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                  Aucun service trouvé
                </td>
              </tr>
            ) : (
              paginatedServices.map((service: any) => {
                return (
                  <tr
                    key={service._id}
                    onClick={() => openView(service)}
                    className='border-b transition-colors hover:bg-muted/50 cursor-pointer'
                  >
                  <td className='px-3 py-2 font-medium'>
                    {service.sigleService}
                  </td>
                  <td className='px-3 py-2'>
                    {service.nomService}
                  </td>
                  <td className='px-3 py-2'>
                    {service.lieuService}
                  </td>
                  <td className='px-3 py-2 text-brand-muted'>
                    {getDirectionLabel(service.direction)}
                  </td>
                  <td className='px-3 py-2 text-brand-muted'>
                    {getUserCount(service)}
                  </td>
                  <td className='pr-3 py-2' onClick={(e) => e.stopPropagation()}>
                    <div className='flex justify-end'>
                      <Popover
                        open={menuServiceId === service._id}
                        onOpenChange={(open) => setMenuServiceId(open ? service._id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Actions'
                            className='text-gray-500 hover:text-brand hover:bg-[#e9f5ee]'
                          >
                            <EllipsisVertical />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align='end' className='w-52 p-1'>
                          <button
                            type='button'
                            onClick={() => openEdit(service)}
                            className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                          >
                            <EditOutlined /> Modifier
                          </button>
                          <button
                            type='button'
                            onClick={() => {
                              setMenuServiceId(null);
                              setServiceToDelete(service);
                            }}
                            className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10'
                          >
                            <DeleteOutlined /> Supprimer
                          </button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        {filteredServices.length > 0 && (
          <div className='flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5'>
            <div className='text-sm text-brand-muted whitespace-nowrap'>
              {startCount}–{endCount} sur {filteredServices.length}{' '}
              {pluriel(filteredServices.length, 'service', 'services')}
            </div>
            <div className='flex items-center gap-1'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
                className='gap-0 px-2'
              >
                <ChevronLeft className='size-4' />
              </Button>
              {renderPageNumbers().map((item, index) =>
                item === "..." ? (
                  <span key={`ellipsis-${index}`} className='px-1 text-sm text-brand-muted'>
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    type='button'
                    size='sm'
                    variant={item === safePage ? 'brand' : 'outline'}
                    onClick={() => goToPage(item)}
                    className='min-w-8 px-2'
                  >
                    {item}
                  </Button>
                ),
              )}
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={safePage >= totalPages}
                onClick={() => goToPage(safePage + 1)}
                className='gap-0 px-2'
              >
                <ChevronRight className='size-4' />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!serviceToDelete}
        title='Supprimer le service ?'
        description={
          <>
            Voulez-vous vraiment supprimer le service{' '}
            <span className='font-medium text-foreground'>
              {serviceToDelete?.sigleService}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={() => handleDelete(serviceToDelete!._id)}
        onCancel={() => setServiceToDelete(null)}
      />
    </>
  );
};

export default ServicesPage;