import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useActivateUser } from "@/hooks/useActivateUser";
import { useDeactivateUser } from "@/hooks/useDeactivateUser";
import { UserInterface } from "@/interfaces/User";
import { getInitials, getUserDisplayName } from "@/utils/User";
import { getServiceLabel, getResponsabiliteLabel } from "@/utils/Label";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const ComptesPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null);
  const [userToToggle, setUserToToggle] = useState<UserInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortNameDir, setSortNameDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: users, isLoading, isError, refetch } = useGetUsers();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutateAsync: activateUser, isPending: isActivating } = useActivateUser();
  const { mutateAsync: deactivateUser, isPending: isDeactivating } = useDeactivateUser();

  useEffect(() => {
    refetchData();
  }, []);

  async function refetchData() {
    refetch();
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortNameDir]);

  const matchesSearch = (user: any) =>
    !searchTerm.trim() ||
    [
      user.nom,
      user.prenom,
      user.email,
      getServiceLabel(user.service),
      getResponsabiliteLabel(user.responsabilite),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const matchesStatus = (user: any) =>
    statusFilter === "all" ||
    (statusFilter === "actif" && user.estActive !== false) ||
    (statusFilter === "inactif" && user.estActive === false);

  const visibleUsers = (users ?? []).filter(
    (user: any) => matchesSearch(user) && matchesStatus(user),
  );

  const sortedUsers = [...visibleUsers].sort((a: any, b: any) =>
    sortNameDir === "asc"
      ? getUserDisplayName(a).localeCompare(getUserDisplayName(b))
      : getUserDisplayName(b).localeCompare(getUserDisplayName(a)),
  );

  const toggleSortName = () => {
    setSortNameDir((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = sortedUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount = sortedUsers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedUsers.length);

  const openView = (user: UserInterface) => {
    navigate(`/admin/compte/view/${user._id}`);
  };

  const openEdit = (user: UserInterface) => {
    navigate(`/admin/compte/edit/${user._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
    } catch {
      return;
    } finally {
      setUserToDelete(null);
    }
  };

  const handleToggle = async () => {
    if (!userToToggle) {
      return;
    }
    setMenuUserId(null);
    try {
      if (userToToggle.estActive) {
        await deactivateUser(userToToggle._id);
      } else {
        await activateUser(userToToggle._id);
      }
    } catch {
      return;
    } finally {
      setUserToToggle(null);
    }
  };

  const isBusy = menuUserId !== null && (isActivating || isDeactivating);

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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-44 shrink-0 border-[#d9dee5]'>
              <Filter className='size-4 text-muted-foreground' />
              <SelectValue placeholder='Filtrer par statut' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les statuts</SelectItem>
              <SelectItem value='actif'>Actifs</SelectItem>
              <SelectItem value='inactif'>Inactifs</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='brand' onClick={() => navigate('/admin/compte/create')} className='shrink-0'>
            <PlusOutlined /> Nouveau compte
          </Button>
        </div>
      </div>

      <div className='panel flex flex-col overflow-hidden rounded-lg'>
        <div className='overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-brand-bg'>
            <tr className='border-b'>
              <th className='pl-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'></th>
              <th
                className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground cursor-pointer select-none'
                onClick={toggleSortName}
              >
                <span className='inline-flex items-center gap-1'>
                  Nom et prénoms
                  {sortNameDir === "asc" ? (
                    <ChevronUp className='size-3.5 text-brand' />
                  ) : (
                    <ChevronDown className='size-3.5 text-brand' />
                  )}
                </span>
              </th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Adresse email</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Service</th>
              <th className='px-3 py-2 text-left align-middle font-medium whitespace-nowrap text-muted-foreground'>Responsabilité</th>
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
                  Une erreur est survenue lors du chargement des comptes.
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <td colSpan={6} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                  Aucun compte trouvé
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user: any) => {
                const isInactive = user.estActive === false;
                return (
                  <tr
                    key={user._id}
                    onClick={() => openView(user)}
                    className={
                      isInactive
                        ? 'border-b bg-gray-50/70 text-gray-400 cursor-pointer transition-colors hover:bg-gray-100/70'
                        : 'border-b cursor-pointer transition-colors hover:bg-muted/50'
                    }
                  >
                    <td className='pl-3 py-2'>
                      <div className='grid place-items-center size-9 rounded-full bg-brand/10 text-brand text-xs font-semibold'>
                        {getInitials(user.nom, user.prenom)}
                      </div>
                    </td>
                    <td className='px-3 py-2 font-medium'>
                      {user.nom?.toUpperCase()} {user.prenom}
                    </td>
                    <td className='px-3 py-2'>
                      {user.email}
                    </td>
                    <td className='px-3 py-2'>
                      {getServiceLabel(user.service)}
                    </td>
                    <td className='px-3 py-2'>
                      {getResponsabiliteLabel(user.responsabilite)}
                    </td>
                    <td className='pr-3 py-2' onClick={(e) => e.stopPropagation()}>
                      <div className='flex justify-end'>
                        <Popover
                          open={menuUserId === user._id}
                          onOpenChange={(open) => setMenuUserId(open ? user._id : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              aria-label='Actions'
                              onClick={(e) => e.stopPropagation()}
                              className='text-gray-500 hover:text-brand hover:bg-[#e9f5ee]'
                            >
                              <EllipsisVertical />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align='end' className='w-52 p-1'>
                            <button
                              type='button'
                              onClick={() => openEdit(user)}
                              className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground'
                            >
                              <EditOutlined /> Modifier
                            </button>
                            {isInactive ? (
                              <button
                                type='button'
                                onClick={() => {
                                  setMenuUserId(null);
                                  setUserToToggle(user);
                                }}
                                disabled={isBusy}
                                className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-green-700 outline-hidden select-none hover:bg-green-50 disabled:opacity-50'
                              >
                                <CheckCircleOutlined /> Activer
                              </button>
                            ) : (
                              <button
                                type='button'
                                onClick={() => {
                                  setMenuUserId(null);
                                  setUserToToggle(user);
                                }}
                                disabled={isBusy}
                                className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-amber-700 outline-hidden select-none hover:bg-amber-50 disabled:opacity-50'
                              >
                                <StopOutlined /> Désactiver
                              </button>
                            )}
                            <button
                              type='button'
                              onClick={() => {
                                setMenuUserId(null);
                                setUserToDelete(user);
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

        {sortedUsers.length > 0 && (
          <div className='flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5'>
            <div className='text-sm text-brand-muted whitespace-nowrap'>
              {startCount}–{endCount} sur {sortedUsers.length}{' '}
              {pluriel(sortedUsers.length, 'compte', 'comptes')}
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
        open={!!userToDelete}
        title='Supprimer le compte ?'
        description={
          <>
            Voulez-vous vraiment supprimer le compte de{' '}
            <span className='font-medium text-foreground'>
              {userToDelete?.nom?.toUpperCase()} {userToDelete?.prenom}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={() => handleDelete(userToDelete!._id)}
        onCancel={() => setUserToDelete(null)}
      />

      <ConfirmDialog
        open={!!userToToggle}
        title={userToToggle?.estActive ? 'Désactiver le compte ?' : 'Activer le compte ?'}
        description={
          <>
            Voulez-vous vraiment{' '}
            {userToToggle?.estActive ? 'désactiver' : 'activer'} le compte de{' '}
            <span className='font-medium text-foreground'>
              {userToToggle?.nom?.toUpperCase()} {userToToggle?.prenom}
            </span>{' '}
            ?
          </>
        }
        warning={
          userToToggle?.estActive
            ? 'Le compte ne pourra plus se connecter.'
            : 'Le compte pourra se connecter.'
        }
        confirmLabel={userToToggle?.estActive ? 'Désactiver' : 'Activer'}
        loadingLabel={userToToggle?.estActive ? 'Désactivation…' : 'Activation…'}
        loading={isActivating || isDeactivating}
        icon={
          userToToggle?.estActive ? (
            <StopOutlined className='text-lg' />
          ) : (
            <CheckCircleOutlined className='text-lg' />
          )
        }
        onConfirm={handleToggle}
        onCancel={() => setUserToToggle(null)}
      />
    </>
  );
};

export default ComptesPage;