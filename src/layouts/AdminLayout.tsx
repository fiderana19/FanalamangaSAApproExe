import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  Tag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetProfile } from "@/hooks/useGetProfile";
import { getRoleLabel } from "@/constants/Role";
import BackButton from "@/components/ui/BackButton";
import NotificationBell from "@/components/Navigation/NotificationBell";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png";

interface NavItem {
  label: string;
  to?: string;
  disabled?: boolean;
  icon: LucideIcon;
}

const MAIN_NAV: NavItem[] = [
  { label: "Accueil", to: "/admin", icon: Home },
  { label: "Service", to: "/admin/service", icon: Building2 },
  { label: "Responsabilité", to: "/admin/responsabilite", icon: Tag },
  { label: "Compte", to: "/admin/compte", icon: Users },
];

const GENERAL_NAV: NavItem[] = [
  { label: "Profil", to: "/admin/profil", icon: User },
  { label: "Paramètres", to: "/admin/parametres", icon: Settings },
  { label: "Aide", to: "/admin/aide", icon: HelpCircle },
];

const PAGE_TITLES: [string, string][] = [
  ["/mot-de-passe", "Changer le mot de passe"],
  ["/service/create", "Nouveau service"],
  ["/service/edit", "Modifier le service"],
  ["/service/view", "Détail du service"],
  ["/service", "Services"],
  ["/responsabilite/create", "Nouvelle responsabilité"],
  ["/responsabilite/edit", "Modifier la responsabilité"],
  ["/responsabilite/view", "Détail de la responsabilité"],
  ["/responsabilite", "Responsabilités"],
  ["/compte/create", "Nouveau compte"],
  ["/compte/edit", "Modifier le compte"],
  ["/compte/view", "Détail du compte"],
  ["/compte", "Comptes"],
  ["/profil", "Profil"],
  ["/parametres", "Paramètres"],
  ["/aide", "Aide"],
];

const AdminLayout: React.FC = () => {
  const { token, logout } = useAuth();
  const location = useLocation();

  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const role: string = decodedToken?.role ?? "admin";

  const { data: profile } = useGetProfile();

  const displayName = profile ? `${profile.nom?.toUpperCase()} ${profile.prenom}` : "Utilisateur";
  const subtitle = getRoleLabel(role);
  const initials = profile
    ? `${profile.nom?.[0] ?? ""}${profile.prenom?.[0] ?? ""}`.toUpperCase()
    : "U";

  const pageTitle =
    PAGE_TITLES.find(([path]) => location.pathname.includes(path))?.[1] ??
    "Accueil";

  const p = location.pathname;
  const needsBack =
    p.includes("/view/") ||
    p.includes("/create") ||
    p.includes("/edit") ||
    p.includes("/import") ||
    p.includes("/bon-magasin/") ||
    p.includes("/mot-de-passe") ||
    p.includes("/controle") ||
    p.includes("/valider");

  const renderNavItem = (item: NavItem) =>
    item.disabled ? (
      <span
        key={item.label}
        title='Bientôt disponible'
        className='block px-3.5 py-3 rounded-md mt-1 text-sm text-brand-muted cursor-not-allowed opacity-60'
      >
        <span className='flex items-center gap-2'>
          <item.icon className='w-4 h-4' />
          {item.label}
        </span>
      </span>
    ) : (
      <NavLink
        key={item.label}
        to={item.to!}
        end
        className={({ isActive }) =>
          `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
            isActive
              ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
              : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
          }`
        }
      >
        <span className='flex items-center gap-2'>
          <item.icon className='w-4 h-4' />
          {item.label}
        </span>
      </NavLink>
    );

  return (
    <div className='flex min-h-screen bg-brand-bg'>
      <aside className='w-[245px] fixed inset-y-0 left-0 bg-white border-r border-brand-border px-4 py-6 flex flex-col'>
        <div className='flex items-center gap-2 px-3 pb-4 mb-5 border-b border-brand-border'>
          <img src={FanalamangaLogo} alt='Logo Fanalamanga' className='w-7 h-7 object-contain' />
          <span className='text-brand text-[15px] leading-tight font-extrabold whitespace-nowrap'>
            FANALAMANGA S.A.
          </span>
        </div>
        <nav className='flex-1 flex flex-col'>
          <div>
            {MAIN_NAV.map(renderNavItem)}
          </div>
          <div className='mt-auto'>
            <div className='text-[11px] text-gray-400 uppercase px-3 mb-2 mt-6 border-t border-brand-border pt-4'>
              Général
            </div>
            {GENERAL_NAV.map(renderNavItem)}
            <button
              onClick={logout}
              className='block w-full text-left px-3.5 py-3 rounded-md mt-1 text-sm text-gray-600 transition-colors hover:bg-[#e9f5ee] hover:text-brand'
            >
              <span className='flex items-center gap-2'>
                <LogOut className='w-4 h-4' />
                Déconnexion
              </span>
            </button>
          </div>
        </nav>
      </aside>

      <main className='ml-[245px] w-[calc(100%-245px)]'>
        <div className='sticky top-0 z-20 flex items-center justify-between py-3.5 px-8 bg-white border border-brand-border'>
          <div className='flex items-center gap-3'>
            {needsBack && <BackButton />}
            <h1 className='text-lg font-bold'>{pageTitle}</h1>
          </div>
          <div className='flex items-center gap-2.5'>
            <NotificationBell />
            <div className='w-[38px] h-[38px] rounded-full bg-brand text-white grid place-items-center font-bold'>
              {initials}
            </div>
            <div className='text-left'>
              <b className='block leading-snug'>{displayName}</b>
              <div className='text-brand-muted text-xs'>{subtitle}</div>
            </div>
          </div>
        </div>
        <div className='px-6 pb-6 pt-3 md:px-8 md:pb-8 md:pt-4'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;