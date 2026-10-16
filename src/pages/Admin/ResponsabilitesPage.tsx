import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetResponsabilites } from "@/hooks/useGetResponsabilites";
import { useDeleteResponsabilite } from "@/hooks/useDeleteResponsabilite";
import { useGetUsers } from "@/hooks/useGetUsers";
import { ResponsabiliteInterface } from "@/interfaces/Responsabilite";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const ResponsabilitesPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuResponsabiliteId, setMenuResponsabiliteId] = useState<string | null>(null);
  const [responsabiliteToDelete, setResponsabiliteToDelete] = useState<ResponsabiliteInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: responsabilites, isLoading, isError, refetch } = useGetResponsabilites();
  const { data: users } = useGetUsers();
  const { mutateAsync: deleteResponsabilite, isPending: isDeleting } = useDeleteResponsabilite();

  useEffect(() => {
    refetchData();
  }, []);

  async function refetchData() {
    refetch();
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const matchesSearch = (responsabilite: any) =>
    !searchTerm.trim() ||
    [responsabilite.libelle, responsabilite.descriptionResponsabilite]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredResponsabilites = (responsabilites ?? []).filter(matchesSearch);

  const totalPages = Math.max(1, Math.ceil(filteredResponsabilites.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResponsabilites = filteredResponsabilites.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount = filteredResponsabilites.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, filteredResponsabilites.length);

  const openEdit = (responsabilite: ResponsabiliteInterface) => {
    navigate(`/admin/responsabilite/edit/${responsabilite._id}`);
  };

  const openView = (responsabilite: ResponsabiliteInterface) => {
    navigate(`/admin/responsabilite/view/${responsabilite._id}`);
  };

  const getUserCount = (responsabilite: ResponsabiliteInterface) =>
    (users ?? []).filter((user: any) => user.responsabilite?._id === responsabilite._id)
      .length;

  const handleDelete = async (id: string) => {
    try {
      await deleteResponsabilite(id);
    } catch {
      return;
    } finally {
      setResponsabiliteToDelete(null);
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
            placeholder='Recherche par libellé'
            className='w-64 border-[#d9dee5] pl-9'
          />
        </div>
        <div className='ml-auto flex items-center gap-3'>
          <Button variant='brand' onClick={() => navigate('/admin/responsabilite/create')} className='shrink-0'>
            <PlusOutlined /> Nouvelle responsabilité
          </Button>
        </div>
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-brand-bg'>
            <tr className='border-b'>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Libellé</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Description</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Utilisateurs</th>
              <th className='py-2 text-right align-middle font-medium whitespace-nowrap text-muted-foreground'></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={4} className='p-2 py-10 text-center align-middle whitespace-nowrap'>
                  <LoadingOutlined className='text-2xl text-brand' />
                </td>
              </tr>
            ) : isError ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={4} className='p-2 py-10 text-center align-middle whitespace-nowrap text-red-500'>
                  Une erreur est survenue lors du chargement des responsabilités.
                </td>
              </tr>
            ) : filteredResponsabilites.length === 0 ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={4} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                  Aucune responsabilité trouvée
                </td>
              </tr>
            ) : (
              paginatedResponsabilites.map((responsabilite: any) => {
                return (
                  <tr
                    key={responsabilite._id}
                    onClick={() => openView(responsabilite)}
                    className='border-b transition-colors hover:bg-muted/50 cursor-pointer'
                  >
                    <td className='px-3 py-2 font-medium'>
                      {responsabilite.libelle}
                    </td>
                    <td className='px-3 py-2 text-brand-muted'>
                      {responsabilite.descriptionResponsabilite}
                    </td>
                    <td className='px-3 py-2 text-brand-muted'>{getUserCount(responsabilite)}</td>
                    <td className='pr-3 py-2' onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-end'>
                        <Popover
                          open={menuResponsabiliteId === responsabilite._id}
                          onOpenChange={(open) => setMenuResponsabiliteId(open ? responsabilite._id : null)}
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
                              onClick={() => openEdit(responsabilite)}
                              className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                            >
                              <EditOutlined /> Modifier
                            </button>
                            <button
                              type='button'
                              onClick={() => {
                                setMenuResponsabiliteId(null);
                                setResponsabiliteToDelete(responsabilite);
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

        {filteredResponsabilites.length > 0 && (
          <div className='flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5'>
            <div className='text-sm text-brand-muted whitespace-nowrap'>
              {startCount}–{endCount} sur {filteredResponsabilites.length}{' '}
              {pluriel(filteredResponsabilites.length, 'responsabilité', 'responsabilités')}
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
        open={!!responsabiliteToDelete}
        title='Supprimer la responsabilité ?'
        description={
          <>
            Voulez-vous vraiment supprimer la responsabilité{' '}
            <span className='font-medium text-foreground'>
              {responsabiliteToDelete?.libelle}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={() => handleDelete(responsabiliteToDelete!._id)}
        onCancel={() => setResponsabiliteToDelete(null)}
      />
    </>
  );
};

export default ResponsabilitesPage;