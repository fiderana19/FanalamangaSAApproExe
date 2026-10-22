import React, { useState } from 'react';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Building2, Mail, MapPin, Phone, Tag, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import PageActionBar from '@/components/ui/PageActionBar';
import { useGetUser } from '@/hooks/useGetUser';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { useActivateUser } from '@/hooks/useActivateUser';
import { useDeactivateUser } from '@/hooks/useDeactivateUser';
import { getRoleLabel } from '@/constants/Role';
import { formatPhone } from '@/utils/Phone';
import { cardClassName } from '@/utils/ClassNames';
import SectionHeader from '@/components/ui/SectionHeader';
import InfoItem from '@/components/ui/InfoItem';
import { getInitials } from '@/utils/User';
import { getResponsabiliteLabel } from '@/utils/Label';

const CompteViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useGetUser(id);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);

  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser({
    action() {
      navigate('/admin/compte');
    },
  });

  const { mutateAsync: activateUser, isPending: isActivating } = useActivateUser();

  const { mutateAsync: deactivateUser, isPending: isDeactivating } =
    useDeactivateUser();

  const isBusy = isActivating || isDeactivating;

  const service =
    user?.service && typeof user.service === 'object' ? user.service : null;

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    try {
      await deleteUser(user._id);
    } catch {
      return;
    } finally {
      setDeleteOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) {
      return;
    }
    try {
      if (user.estActive) {
        await deactivateUser(user._id);
      } else {
        await activateUser(user._id);
      }
    } catch {
      return;
    } finally {
      setToggleOpen(false);
    }
  };

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1 pb-14'>
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <LoadingOutlined className='text-4xl text-brand' />
          </div>
        ) : isError || !user ? (
          <div className='text-center text-red-500'>
            Une erreur est survenue lors du chargement du compte.
          </div>
        ) : (
          <div className='flex flex-col w-full gap-5'>
            <div className='flex items-center justify-center gap-2'>
              <Users className='w-5 h-5 text-brand' />
              <h2 className='text-lg font-bold'>Détail du compte</h2>
            </div>

            <div className='flex flex-col md:flex-row gap-5 items-start'>
              <div className='flex flex-col gap-5 w-full'>
                <div className={`${cardClassName} w-full`}>
                <div className='flex items-center gap-4 pb-4 mb-5'>
                  <div className='grid place-items-center size-16 rounded-full bg-brand text-white font-bold text-xl shrink-0'>
                    {getInitials(user.nom, user.prenom)}
                  </div>
                  <div className='flex flex-col gap-1 min-w-0'>
                    <h1 className='text-lg font-bold truncate'>
                      {[user.nom?.toUpperCase(), user.prenom].filter(Boolean).join(' ')}
                    </h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='text-sm text-brand-muted'>
                        {getRoleLabel(user.role)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          user.estActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {user.estActive ? (
                          <CheckCircleOutlined />
                        ) : (
                          <StopOutlined />
                        )}
                        {user.estActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  <InfoItem
                    variant='plain'
                    icon={<Mail className='w-5 h-5' />}
                    value={user.email}
                  />
                  <InfoItem
                    variant='plain'
                    icon={<Phone className='w-5 h-5' />}
                    value={formatPhone(user.telephone)}
                  />
                </div>
              </div>

              <div className={`${cardClassName} w-full`}>
                <SectionHeader title='Service de l’utilisateur' />
                {service ? (
                  <div className='flex items-center gap-3'>
                    <div className='grid place-items-center size-12 rounded-lg bg-brand/10 text-brand shrink-0'>
                      <Building2 className='w-6 h-6' />
                    </div>
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <span className='text-sm font-medium text-foreground break-words'>
                        {[service.sigleService, service.nomService]
                          .filter(Boolean)
                          .join(' - ')}
                      </span>
                      <span className='flex items-center gap-1.5 text-sm text-brand-muted min-w-0'>
                        <MapPin className='w-4 h-4 shrink-0' />
                        <span className='truncate'>
                          {service.lieuService}
                        </span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className='text-sm font-medium text-foreground' />
                )}
              </div>
            </div>

            <div className='flex flex-col gap-5 w-full'>
              <div className={`${cardClassName} w-full`}>
                <SectionHeader title='Responsabilité' />
                <InfoItem
                  icon={<Tag className='w-6 h-6' />}
                  value={getResponsabiliteLabel(user.responsabilite)}
                />
              </div>

              <div className={`${cardClassName} w-full`}>
                <SectionHeader title='Responsabilité' />
                <InfoItem
                  icon={<Tag className='w-6 h-6' />}
                  value={getResponsabiliteLabel(user.responsabilite)}
                />
              </div>
            </div>
          </div>

          <PageActionBar>
            <Button
              type='button'
              variant='brand'
              onClick={() => navigate(`/admin/compte/edit/${user._id}`)}
              className='shrink-0 shadow-md'
            >
              <EditOutlined /> Modifier
            </Button>
            <Button
              type='button'
              variant={user.estActive ? 'alert' : 'brand'}
              onClick={() => setToggleOpen(true)}
              disabled={isBusy}
              className='shrink-0 shadow-md'
            >
              {isBusy ? <LoadingOutlined /> : null}
              {user.estActive ? (
                <>
                  <StopOutlined /> Désactiver
                </>
              ) : (
                <>
                  <CheckCircleOutlined /> Activer
                </>
              )}
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
              className='shrink-0 shadow-md'
            >
              {isDeleting ? <LoadingOutlined /> : <DeleteOutlined />}
              Supprimer
            </Button>
          </PageActionBar>
        </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title='Supprimer le compte ?'
        description={
          <>
            Voulez-vous vraiment supprimer le compte de{' '}
            <span className='font-medium text-foreground'>
              {user?.nom?.toUpperCase()} {user?.prenom}
            </span>{' '}
            ?
          </>
        }
        warning='Cette action est irréversible.'
        confirmLabel='Supprimer'
        loadingLabel='Suppression…'
        loading={isDeleting}
        icon={<DeleteOutlined className='text-lg' />}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={toggleOpen}
        title={user?.estActive ? 'Désactiver le compte ?' : 'Activer le compte ?'}
        description={
          <>
            Voulez-vous vraiment {user?.estActive ? 'désactiver' : 'activer'} le
            compte de{' '}
            <span className='font-medium text-foreground'>
              {user?.nom?.toUpperCase()} {user?.prenom}
            </span>{' '}
            ?
          </>
        }
        warning={
          user?.estActive
            ? 'Le compte ne pourra plus se connecter.'
            : 'Le compte pourra se connecter.'
        }
        tone={user?.estActive ? 'danger' : 'brand'}
        confirmVariant={user?.estActive ? 'alert' : 'brand'}
        confirmLabel={user?.estActive ? 'Désactiver' : 'Activer'}
        loadingLabel={user?.estActive ? 'Désactivation…' : 'Activation…'}
        loading={isActivating || isDeactivating}
        icon={
          user?.estActive ? (
            <StopOutlined className='text-lg' />
          ) : (
            <CheckCircleOutlined className='text-lg' />
          )
        }
        onConfirm={handleToggleStatus}
        onCancel={() => setToggleOpen(false)}
      />
    </div>
  );
};

export default CompteViewPage;