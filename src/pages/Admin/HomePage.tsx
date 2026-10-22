import { Building2, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { QuickActions, type QuickAction } from "@/components/dashboard/QuickActions";
import { type ApexChartOptions } from "@/components/dashboard/ApexChart";
import { useGetServices } from "@/hooks/useGetServices";
import { useGetResponsabilites } from "@/hooks/useGetResponsabilites";
import { useGetUsers } from "@/hooks/useGetUsers";
import { ServiceInterface } from "@/interfaces/Service";
import { ResponsabiliteInterface } from "@/interfaces/Responsabilite";
import { UserInterface } from "@/interfaces/User";
import { getRoleLabel } from "@/constants/Role";
import { CHART_COLORS } from "@/constants/Dashboard";
import { compterPar, construireDonut } from "@/utils/Dashboard";
import { pluriel } from "@/utils/Pluriel";

const actions: QuickAction[] = [
    { label: "Nouveau service", to: "/admin/service/create", icon: Building2, variant: "brand" },
    { label: "Nouvelle responsabilité", to: "/admin/responsabilite/create", icon: ShieldCheck, variant: "brand" },
    { label: "Nouveau compte", to: "/admin/compte/create", icon: UserPlus, variant: "brand" },
];

const HomePage = () => {
    const { data: servicesData, isLoading: servicesLoading } = useGetServices();
    const { data: responsabilitesData, isLoading: responsabilitesLoading } = useGetResponsabilites();
    const { data: usersData, isLoading: usersLoading } = useGetUsers();

    const services = (servicesData as ServiceInterface[] | undefined) ?? [];
    const responsabilites = (responsabilitesData as ResponsabiliteInterface[] | undefined) ?? [];
    const users = (usersData as UserInterface[] | undefined) ?? [];

    const comptesActifs = users.filter((user) => user.estActive).length;
    const comptesParRole = compterPar(users, (user) => user.role);
    const comptesParEtat = compterPar(users, (user) => (user.estActive ? "actif" : "inactif"));

    const roleDonut = construireDonut(
        comptesParRole,
        getRoleLabel,
        (_cle, index) => CHART_COLORS[index % CHART_COLORS.length]
    );
    const etatDonut = construireDonut(
        comptesParEtat,
        (cle) => (cle === "actif" ? "Actifs" : "Inactifs"),
        (cle) => (cle === "actif" ? "#10b981" : "#9ca3af")
    );

    const roleOptions: ApexChartOptions = {
        labels: roleDonut.labels,
        colors: roleDonut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    const etatOptions: ApexChartOptions = {
        labels: etatDonut.labels,
        colors: etatDonut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    return (
        <div className='space-y-5'>
            <DashboardHeader />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label="Services"
                    value={services.length}
                    icon={Building2}
                    accent="brand"
                    isLoading={servicesLoading}
                />
                <StatCard
                    label="Responsabilités"
                    value={responsabilites.length}
                    icon={ShieldCheck}
                    accent="violet"
                    isLoading={responsabilitesLoading}
                />
                <StatCard
                    label="Comptes"
                    value={users.length}
                    icon={Users}
                    accent="blue"
                    isLoading={usersLoading}
                />
                <StatCard
                    label="Comptes actifs"
                    value={comptesActifs}
                    icon={UserCheck}
                    accent="emerald"
                    hint={`${users.length - comptesActifs} ${pluriel(users.length - comptesActifs, "inactif", "inactifs")}`}
                    isLoading={usersLoading}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                <ChartCard
                    title="Comptes par rôle"
                    type="donut"
                    series={roleDonut.series}
                    options={roleOptions}
                    isLoading={usersLoading}
                    isEmpty={roleDonut.total === 0}
                />
                <ChartCard
                    title="Comptes actifs / inactifs"
                    type="donut"
                    series={etatDonut.series}
                    options={etatOptions}
                    isLoading={usersLoading}
                    isEmpty={etatDonut.total === 0}
                />
            </div>

            <QuickActions actions={actions} />
        </div>
    );
};

export default HomePage;
