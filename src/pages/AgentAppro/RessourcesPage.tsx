import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useGetRessources } from "@/hooks/useGetRessources";
import { useDeleteRessource } from "@/hooks/useDeleteRessource";
import { RessourceInterface } from "@/interfaces/Ressource";
import { CATEGORIES, getCategorieLabel } from "@/constants/RessourceCategorie";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const RessourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuRessourceId, setMenuRessourceId] = useState<string | null>(null);
  const [ressourceToDelete, setRessourceToDelete] = useState<RessourceInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: ressources, isLoading, isError, refetch } = useGetRessources();
  const { mutateAsync: deleteRessource, isPending: isDeleting } = useDeleteRessource();

  useEffect(() => {
    refetchData();
  }, []);

  async function refetchData() {
    refetch();
  }

  const filterRessources = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRef, filterText]);

  const matchesSearch = (ressource: any) =>
    !searchTerm.trim() ||
    [ressource.reference, ressource.designationRessource, ressource.ressourceDescription]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredRessources = (filterRef
    ? (ressources ?? []).filter((ressource: any) => ressource.categorie === filterText)
    : ressources ?? []
  ).filter(matchesSearch);

  const totalPages = Math.max(1, Math.ceil(filteredRessources.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRessources = filteredRessources.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount = filteredRessources.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, filteredRessources.length);

  const openEdit = (ressource: RessourceInterface) => {
    navigate(`/agent_appro/ressource/edit/${ressource._id}`);
  };

  const openView = (ressource: RessourceInterface) => {
    navigate(`/agent_appro/ressource/view/${ressource._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRessource(id);
    } catch {
      return;
    } finally {
      setRessourceToDelete(null);
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
            placeholder='Recherche par référence ou désignation'
            className='w-64 border-[#d9dee5] pl-9'
          />
        </div>
        <div className='ml-auto flex items-center gap-3'>
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterRessources(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className='w-44 shrink-0 border-[#d9dee5]'>
              <Filter className='size-4 text-muted-foreground' />
              <SelectValue placeholder='Filtrer par catégorie' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Toutes les catégories</SelectItem>
              {CATEGORIES.map((categorie) => (
                <SelectItem key={categorie} value={categorie}>
                  {getCategorieLabel(categorie)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='inline-flex shrink-0 overflow-hidden rounded-md'>
            <Button
              variant='brand'
              onClick={() => navigate('/agent_appro/ressource/create')}
              className='rounded-none'
            >
              <PlusOutlined /> Nouvelle ressource
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='brand'
                  aria-label='Plus d’options'
                  className='rounded-none border-l border-white/30 px-2.5'
                >
                  <ChevronDown className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuItem
                  onSelect={() => navigate('/agent_appro/ressource/import')}
                  className='text-brand focus:bg-brand/10 focus:text-brand'
                >
                  <UploadOutlined /> Importer un fichier JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50/80 sticky top-0 z-10'>
            <tr className='border-b border-brand-border'>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Référence</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Désignation</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Description</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Catégorie</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Unité</th>
              <th className='py-3 pr-4 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'></th>
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
                  Une erreur est survenue lors du chargement des ressources.
                </td>
              </tr>
            ) : filteredRessources.length === 0 ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                  Aucune ressource trouvée
                </td>
              </tr>
            ) : (
              paginatedRessources.map((ressource: any) => {
                return (
                  <tr
                    key={ressource._id}
                    onClick={() => openView(ressource)}
                    className='border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors cursor-pointer hover:bg-[#e9f5ee]/40 hover:border-l-brand last:border-b-0'
                  >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                      {ressource.reference}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className='font-medium text-foreground'>
                      {ressource.designationRessource}
                    </span>
                  </td>
                  <td className='px-4 py-3 align-middle'>
                    <span className='block max-w-[300px] text-[13px] leading-snug text-muted-foreground line-clamp-2'>
                      {ressource.ressourceDescription}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <RessourceCategorieBadge categorie={ressource.categorie} />
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className='text-muted-foreground'>
                      {getUniteLabel(ressource.unite)}
                    </span>
                  </td>
                  <td className='pr-4 py-3' onClick={(e) => e.stopPropagation()}>
                    <div className='flex justify-end'>
                      <Popover
                        open={menuRessourceId === ressource._id}
                        onOpenChange={(open) => setMenuRessourceId(open ? ressource._id : null)}
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
                            onClick={() => openEdit(ressource)}
                            className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                          >
                            <EditOutlined /> Modifier
                          </button>
                          <button
                            type='button'
                            onClick={() => {
                              setMenuRessourceId(null);
                              setRessourceToDelete(ressource);
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

      {filteredRessources.length > 0 && (
        <div className='flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5'>
          <div className='text-sm text-brand-muted whitespace-nowrap'>
            {startCount}–{endCount} sur {filteredRessources.length}{' '}
            {pluriel(filteredRessources.length, 'ressource', 'ressources')}
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
        open={!!ressourceToDelete}
        title='Supprimer la ressource ?'
        description={
          <>
            Voulez-vous vraiment supprimer la ressource{' '}
            <span className='font-medium text-foreground'>
              {ressourceToDelete?.designationRessource}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={() => handleDelete(ressourceToDelete!._id)}
        onCancel={() => setRessourceToDelete(null)}
      />
    </>
  );
};

export default RessourcesPage;