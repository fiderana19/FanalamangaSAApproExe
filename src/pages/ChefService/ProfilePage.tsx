import React from 'react';
import {
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Building2, KeyRound, Mail, MapPin, Phone, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/hooks/useGetProfile';
import { ProfileInterface } from '@/interfaces/User';
import { getRoleLabel } from '@/constants/Role';
import { formatPhone } from '@/utils/Phone';
import { cardClassName } from '@/utils/ClassNames';
import SectionHeader from '@/components/ui/SectionHeader';
import InfoItem from '@/components/ui/InfoItem';
import { getInitials } from '@/utils/User';
import { getResponsabiliteLabel } from '@/utils/Label';

const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useGetProfile();
  const navigate = useNavigate();

  const changePasswordUrl = '/chef_service/profil/mot-de-passe';

  if (isLoading || !profile) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center'>
        <LoadingOutlined className='text-4xl text-brand' />
      </div>
    );
  }

  const user = profile as ProfileInterface;
  const service =
    user.service && typeof user.service === 'object' ? user.service : null;

  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1'>
        <div className='flex flex-col w-full gap-5'>
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
                      {user.estActive !== undefined && (
                        <span className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-green-50 text-green-700'>
                          <CheckCircleOutlined /> Actif
                        </span>
                      )}
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
                <SectionHeader title='Service' />
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
                <SectionHeader title='Sécurité' />
                <p className='text-sm text-gray-600 mb-4'>
                  Gérez votre mot de passe professionnel.
                </p>
                <Button
                  type='button'
                  variant='secondary'
                  className='w-full'
                  onClick={() => navigate(changePasswordUrl)}
                >
                  <KeyRound className='w-4 h-4' />
                  Changer mon mot de passe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;