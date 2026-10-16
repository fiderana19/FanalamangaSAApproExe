import { Clock, FilePlus2, FileText, Truck, Warehouse } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { QuickActions, type QuickAction } from "@/components/dashboard/QuickActions";
import { RecentActivitiesList } from "@/components/dashboard/RecentActivitiesList";
import { type ApexChartOptions } from "@/components/dashboard/ApexChart";
import { useGetDemandesMine } from "@/hooks/useGetDemandesMine";
import { useGetMesLivraisons } from "@/hooks/useGetMesLivraisons";
import { DemandeInterface } from "@/interfaces/Demande";
import { LivraisonInterface } from "@/interfaces/Livraison";
import { getDemandeStatutLabel } from "@/constants/DemandeStatut";
import { CHART_BRAND, CHART_GRID, getStatutChartColor } from "@/constants/Dashboard";
import {
    compterPar,
    construireBarres,
    construireDonut,
    derniersParDate,
    regrouperParMois,
} from "@/utils/Dashboard";

const actions: QuickAction[] = [
    { label: "Nouvelle demande", to: "/employe/demande/create", icon: FilePlus2, variant: "brand" },
];

const HomePage = () => {
    const { data: demandesData, isLoading: demandesLoading } = useGetDemandesMine();
    const { data: livraisonsData, isLoading: livraisonsLoading } = useGetMesLivraisons();

    const demandes = (demandesData as DemandeInterface[] | undefined) ?? [];
    const livraisons = (livraisonsData as LivraisonInterface[] | undefined) ?? [];

    const demandesParStatut = compterPar(demandes, (demande) => demande.statutActuelDemande);
    const donut = construireDonut(demandesParStatut, getDemandeStatutLabel, getStatutChartColor);
    const barres = construireBarres(
        regrouperParMois(demandes, (demande) => demande.dateDemande),
        "Demandes"
    );

    const donutOptions: ApexChartOptions = {
        labels: donut.labels,
        colors: donut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    const areaOptions: ApexChartOptions = {
        xaxis: { categories: barres.categories },
        colors: [CHART_BRAND],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
        grid: { borderColor: CHART_GRID },
    };

    const recentes = derniersParDate(demandes, (demande) => demande.dateDemande, 5).map(
        (demande) => ({
            id: demande._id,
            title: demande.numeroDemande,
            subtitle: demande.motif,
            meta: getDemandeStatutLabel(demande.statutActuelDemande),
            to: `/employe/demande/view/${demande._id}`,
        })
    );

    const livraisonsAReceptionner = livraisons.filter(
        (livraison) => livraison.statutLivraison !== "livree"
    ).length;

    return (
        <div className='space-y-5'>
            <DashboardHeader />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label="Demandes"
                    value={demandes.length}
                    icon={FileText}
                    accent="brand"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="En attente"
                    value={demandesParStatut["en_attente"] ?? 0}
                    icon={Clock}
                    accent="amber"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="En bon de magasin"
                    value={demandesParStatut["en_bon_magasin"] ?? 0}
                    icon={Warehouse}
                    accent="teal"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="Livraisons à réceptionner"
                    value={livraisonsAReceptionner}
                    icon={Truck}
                    accent="sky"
                    isLoading={livraisonsLoading}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                <ChartCard
                    title="Mes demandes par statut"
                    type="donut"
                    series={donut.series}
                    options={donutOptions}
                    isLoading={demandesLoading}
                    isEmpty={donut.total === 0}
                />
                <ChartCard
                    title="Demandes par mois"
                    subtitle="6 derniers mois"
                    type="area"
                    series={barres.series}
                    options={areaOptions}
                    isLoading={demandesLoading}
                    isEmpty={demandes.length === 0}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                <RecentActivitiesList
                    title="Dernières demandes"
                    items={recentes}
                    isLoading={demandesLoading}
                />
                <QuickActions actions={actions} />
            </div>
        </div>
    );
};

export default HomePage;
