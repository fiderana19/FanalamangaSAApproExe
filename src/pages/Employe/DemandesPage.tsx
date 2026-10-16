import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Filter,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetDemandesMine } from "@/hooks/useGetDemandesMine";
import { useDeleteDemande } from "@/hooks/useDeleteDemande";
import { DemandeInterface } from "@/interfaces/Demande";
import { DEMANDE_STATUTS, getDemandeStatutLabel } from "@/constants/DemandeStatut";
import DemandeStatutBadge from "@/components/status/DemandeStatutBadge";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const DemandesPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuDemandeId, setMenuDemandeId] = useState<string | null>(null);
  const [demandeToDelete, setDemandeToDelete] = useState<DemandeInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: demandes, isLoading, isError } = useGetDemandesMine();
  const { mutateAsync: deleteDemande, isPending: isDeleting } = useDeleteDemande();

  const filterDemandes = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (demande: DemandeInterface) =>
    !searchTerm.trim() ||
    [demande.numeroDemande, demande.motif]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredDemandes = (filterRef
    ? (demandes ?? []).filter((demande: DemandeInterface) => demande.statutActuelDemande === filterText)
    : demandes ?? []
  ).filter(matchesSearch);

  const sortedDemandes = sortDateDir
    ? [...filteredDemandes].sort((a: DemandeInterface, b: DemandeInterface) =>
        sortDateDir === "asc"
          ? new Date(a.dateDemande).getTime() - new Date(b.dateDemande).getTime()
          : new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime(),
      )
    : filteredDemandes;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedDemandes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDemandes = sortedDemandes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount = sortedDemandes.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedDemandes.length);

  const openEdit = (demande: DemandeInterface) => {
    navigate(`/employe/demande/edit/${demande._id}`);
  };

  const openView = (demande: DemandeInterface) => {
    navigate(`/employe/demande/view/${demande._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDemande(id);
    } catch {
      return;
    } finally {
      setDemandeToDelete(null);
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
            placeholder='Recherche par numéro ou motif'
            className='w-64 border-[#d9dee5] pl-9'
          />
        </div>
        <div className='ml-auto flex items-center gap-3'>
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterDemandes(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className='w-48 shrink-0 border-[#d9dee5]'>
              <Filter className='size-4 text-muted-foreground' />
              <SelectValue placeholder='Filtrer par statut' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les statuts</SelectItem>
              {DEMANDE_STATUTS.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {getDemandeStatutLabel(statut)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            variant='brand'
            onClick={() => navigate('/employe/demande/create')}
            className='shrink-0'
          >
            <PlusOutlined /> Nouvelle demande
          </Button>
        </div>
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50/80 sticky top-0 z-10'>
            <tr className='border-b border-brand-border'>
              <th className='w-10 px-4 py-3'></th>
              <th
                className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground cursor-pointer select-none'
                onClick={toggleSortDate}
              >
                <span className='inline-flex items-center gap-1'>
                  Date de la demande
                  {sortDateDir === "asc" ? (
                    <ChevronUp className='size-3.5 text-brand' />
                  ) : (
                    <ChevronDown className='size-3.5 text-brand' />
                  )}
                </span>
              </th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>N° demande</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Motif</th>
              <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Statut</th>
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
                  Une erreur est survenue lors du chargement des demandes.
                </td>
              </tr>
            ) : sortedDemandes.length === 0 ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              paginatedDemandes.map((demande: DemandeInterface) => {
                return (
                  <tr
                    key={demande._id}
                    onClick={() => openView(demande)}
                    className={`border-b border-[#f1f5f9] border-l-2 transition-colors cursor-pointer last:border-b-0 ${
                      demande.urgence
                        ? 'border-l-red-400 bg-red-50/60 hover:bg-red-100/50 hover:border-l-red-400'
                        : 'border-l-transparent hover:bg-[#e9f5ee]/40 hover:border-l-brand'
                    }`}
                  >
                  <td className='px-4 py-3'>
                    {demande.urgence ? (
                      <Zap className='size-5 text-red-500' />
                    ) : null}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap text-muted-foreground'>
                    {formatDate(demande.dateDemande)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                      {demande.numeroDemande}
                    </span>
                  </td>
                  <td className='px-4 py-3 max-w-[320px]'>
                    <span className='block font-medium text-foreground truncate'>
                      {demande.motif}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <DemandeStatutBadge statut={demande.statutActuelDemande} />
                  </td>
                  <td className='pr-4 py-3' onClick={(e) => e.stopPropagation()}>
                    <div className='flex justify-end'>
                      <Popover
                        open={menuDemandeId === demande._id}
                        onOpenChange={(open) => setMenuDemandeId(open ? demande._id : null)}
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
                            onClick={() => openView(demande)}
                            className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                          >
                            <EyeOutlined /> Voir
                          </button>
                          {demande.statutActuelDemande === "en_attente" && (
                            <>
                              <button
                                type='button'
                                onClick={() => openEdit(demande)}
                                className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                              >
                                <EditOutlined /> Modifier
                              </button>
                              <button
                                type='button'
                                onClick={() => {
                                  setMenuDemandeId(null);
                                  setDemandeToDelete(demande);
                                }}
                                className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10'
                              >
                                <DeleteOutlined /> Supprimer
                              </button>
                            </>
                          )}
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

      {sortedDemandes.length > 0 && (
        <div className='flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5'>
          <div className='text-sm text-brand-muted whitespace-nowrap'>
            {startCount}–{endCount} sur {sortedDemandes.length}{' '}
            {pluriel(sortedDemandes.length, 'demande', 'demandes')}
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
        open={!!demandeToDelete}
        title='Supprimer la demande ?'
        description={
          <>
            Voulez-vous vraiment supprimer la demande{' '}
            <span className='font-medium text-foreground'>
              {demandeToDelete?.numeroDemande}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={() => handleDelete(demandeToDelete!._id)}
        onCancel={() => setDemandeToDelete(null)}
      />
    </>
  );
};

export default DemandesPage;