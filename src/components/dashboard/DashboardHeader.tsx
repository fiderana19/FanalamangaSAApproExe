import { useGetProfile } from "@/hooks/useGetProfile";
import { getRoleLabel } from "@/constants/Role";
import { getResponsabiliteLabel, getServiceLabel } from "@/utils/Label";
import { ProfileInterface } from "@/interfaces/User";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png";

const aujourdHui = () =>
    new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

export const DashboardHeader = () => {
    const { data, isLoading } = useGetProfile();
    const profil = data as ProfileInterface | undefined;

    const nomComplet = profil
        ? `${profil.nom?.toUpperCase() ?? ""} ${profil.prenom ?? ""}`.trim()
        : "";
    const responsabilite = getResponsabiliteLabel(profil?.responsabilite);
    const service = getServiceLabel(profil?.service);
    const details =
        [responsabilite, service].filter(Boolean).join(" · ") || getRoleLabel(profil?.role);

    return (
        <div className='panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
                <img
                    src={FanalamangaLogo}
                    alt='Logo Fanalamanga'
                    className='size-12 shrink-0 object-contain'
                />
                <div className='min-w-0'>
                    {isLoading ? (
                        <div className='h-6 w-48 animate-pulse rounded bg-gray-100' />
                    ) : (
                        <h1 className='truncate text-xl font-bold text-gray-800'>
                            Bonjour{nomComplet ? ` ${nomComplet}` : ""}
                        </h1>
                    )}
                    <p className='truncate text-sm text-brand-muted'>{details}</p>
                </div>
            </div>

            <div className='shrink-0 text-sm capitalize text-brand-muted'>{aujourdHui()}</div>
        </div>
    );
};
