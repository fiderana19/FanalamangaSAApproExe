import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, HelpCircle, Home, LogOut, ShoppingCart, Truck, User, Warehouse } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetProfile } from "@/hooks/useGetProfile";
import { getRoleLabel } from "@/constants/Role";
import BackButton from "@/components/ui/BackButton";
import NotificationBell from "@/components/Navigation/NotificationBell";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png";

const PAGE_TITLES: [string, string][] = [
  ["/mot-de-passe", "Changer le mot de passe"],
  ["/demande/create", "Nouvelle demande"],
  ["/demande/edit", "Modifier la demande"],
  ["/demande/view", "Détail de la demande"],
  ["/demande/bon-magasin", "Établir un bon de magasin"],
  ["/demande", "Demandes"],
  ["/approvisionnement/view", "Détail de l'approvisionnement"],
  ["/approvisionnement", "Approvisionnements"],
  ["/livraison/scan", "Scanner un bon de sortie"],
  ["/livraison/reception", "Réception d'une livraison"],
  ["/livraison/view", "Détail de la livraison"],
  ["/livraison", "Livraisons"],
  ["/bon-magasin/view", "Détail du bon de magasin"],
  ["/bon-magasin", "Bons de magasin"],
  ["/profil", "Profil"],
  ["/aide", "Aide"],
];

const EmployeLayout: React.FC = () => {
  const { token, logout } = useAuth();
  const location = useLocation();

  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const role: string = decodedToken?.role ?? "employe";

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
    p.includes("/reception") ||
    p.includes("/scan") ||
    p.includes("/mot-de-passe") ||
    p.includes("/controle") ||
    p.includes("/valider");

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
            <NavLink
              to='/employe'
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
                <Home className='w-4 h-4' />
                Accueil
              </span>
            </NavLink>
          </div>
          <div>
            <NavLink
              to='/employe/demande'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <ClipboardList className='w-4 h-4' />
                Demande
              </span>
            </NavLink>
            <NavLink
              to='/employe/bon-magasin'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <Warehouse className='w-4 h-4' />
                Bon de magasin
              </span>
            </NavLink>
            <NavLink
              to='/employe/approvisionnement'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <ShoppingCart className='w-4 h-4' />
                Approvisionnement
              </span>
            </NavLink>
            <NavLink
              to='/employe/livraison'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <Truck className='w-4 h-4' />
                Livraison
              </span>
            </NavLink>
          </div>
          <div className='mt-auto'>
            <div className='text-[11px] text-gray-400 uppercase px-3 mb-2 mt-6 border-t border-brand-border pt-4'>
              Général
            </div>
            <NavLink
              to='/employe/profil'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <User className='w-4 h-4' />
                Profil
              </span>
            </NavLink>
            <NavLink
              to='/employe/aide'
              className={({ isActive }) =>
                `block border-l-4 px-3.5 py-3 rounded-md mt-1 text-sm transition-colors ${
                  isActive
                    ? 'border-brand bg-[#e9f5ee] text-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-[#e9f5ee] hover:text-brand'
                }`
              }
            >
              <span className='flex items-center gap-2'>
                <HelpCircle className='w-4 h-4' />
                Aide
              </span>
            </NavLink>
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

export default EmployeLayout;