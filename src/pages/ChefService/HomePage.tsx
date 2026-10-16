import { CheckCircle2, Clock, FileText, Package } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RecentActivitiesList } from "@/components/dashboard/RecentActivitiesList";
import { type ApexChartOptions } from "@/components/dashboard/ApexChart";
import { useGetDemandesService } from "@/hooks/useGetDemandesService";
import { useGetBonsMagasinService } from "@/hooks/useGetBonsMagasinService";
import { DemandeInterface } from "@/interfaces/Demande";
import { BonMagasinInterface } from "@/interfaces/BonMagasin";
import { getDemandeStatutLabel } from "@/constants/DemandeStatut";
import { CHART_BRAND, CHART_GRID, getStatutChartColor } from "@/constants/Dashboard";
import {
    compterPar,
    construireBarres,
    construireDonut,
    derniersParDate,
    regrouperParMois,
} from "@/utils/Dashboard";

const HomePage = () => {
    const { data: demandesData, isLoading: demandesLoading } = useGetDemandesService();
    const { data: bonsData, isLoading: bonsLoading } = useGetBonsMagasinService();

    const demandes = (demandesData as DemandeInterface[] | undefined) ?? [];
    const bons = (bonsData as BonMagasinInterface[] | undefined) ?? [];

    const demandesParStatut = compterPar(demandes, (demande) => demande.statutActuelDemande);
    const enAttente = demandesParStatut["en_attente"] ?? 0;

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

    const recentes = derniersParDate(
        demandes.filter((demande) => demande.statutActuelDemande === "en_attente"),
        (demande) => demande.dateDemande,
        5
    ).map((demande) => ({
        id: demande._id,
        title: demande.numeroDemande,
        subtitle: demande.motif,
        meta: getDemandeStatutLabel(demande.statutActuelDemande),
        to: `/chef_service/demande/view/${demande._id}`,
    }));

    return (
        <div className='space-y-5'>
            <DashboardHeader />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label="Demandes du service"
                    value={demandes.length}
                    icon={FileText}
                    accent="brand"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="À valider"
                    value={enAttente}
                    icon={Clock}
                    accent="amber"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="Traitées"
                    value={demandes.length - enAttente}
                    icon={CheckCircle2}
                    accent="emerald"
                    isLoading={demandesLoading}
                />
                <StatCard
                    label="Bons de magasin"
                    value={bons.length}
                    icon={Package}
                    accent="teal"
                    isLoading={bonsLoading}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                <ChartCard
                    title="Demandes par statut"
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

            <RecentActivitiesList
                title="Demandes en attente de validation"
                items={recentes}
                isLoading={demandesLoading}
                emptyLabel="Aucune demande en attente"
            />
        </div>
    );
};

export default HomePage;
