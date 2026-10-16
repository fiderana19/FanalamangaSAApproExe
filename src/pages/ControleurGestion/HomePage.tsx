import { CheckCircle2, ClipboardCheck, ClipboardList, XCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RecentActivitiesList } from "@/components/dashboard/RecentActivitiesList";
import { type ApexChartOptions } from "@/components/dashboard/ApexChart";
import { useGetDemandesAControler } from "@/hooks/useGetDemandesAControler";
import { useGetHistoriqueControles } from "@/hooks/useGetHistoriqueControles";
import { ControleInterface, DemandeInterface } from "@/interfaces/Demande";
import { CHART_BRAND, CHART_GRID, getStatutChartColor } from "@/constants/Dashboard";
import {
    compterPar,
    construireBarres,
    construireDonut,
    derniersParDate,
    regrouperParMois,
} from "@/utils/Dashboard";

const libelleConformite = (cle: string) => (cle === "conforme" ? "Conforme" : "Non conforme");

const HomePage = () => {
    const { data: aControlerData, isLoading: aControlerLoading } = useGetDemandesAControler();
    const { data: historiqueData, isLoading: historiqueLoading } = useGetHistoriqueControles();

    const aControler = (aControlerData as DemandeInterface[] | undefined) ?? [];
    const historique = (historiqueData as ControleInterface[] | undefined) ?? [];

    const controlesParStatut = compterPar(historique, (controle) => controle.statutControle);
    const conformes = controlesParStatut["conforme"] ?? 0;
    const nonConformes = controlesParStatut["non_conforme"] ?? 0;

    const donut = construireDonut(controlesParStatut, libelleConformite, getStatutChartColor);
    const barres = construireBarres(
        regrouperParMois(historique, (controle) => controle.dateControle),
        "Contrôles"
    );

    const donutOptions: ApexChartOptions = {
        labels: donut.labels,
        colors: donut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    const barOptions: ApexChartOptions = {
        xaxis: { categories: barres.categories },
        colors: [CHART_BRAND],
        plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
        dataLabels: { enabled: false },
        grid: { borderColor: CHART_GRID },
    };

    const recentes = derniersParDate(aControler, (demande) => demande.dateDemande, 5).map(
        (demande) => ({
            id: demande._id,
            title: demande.numeroDemande,
            subtitle: demande.motif,
            meta: demande.urgence ? "Urgent" : undefined,
            to: `/controleur_gestion/demande/view/${demande._id}`,
        })
    );

    return (
        <div className='space-y-5'>
            <DashboardHeader />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label="À contrôler"
                    value={aControler.length}
                    icon={ClipboardList}
                    accent="amber"
                    isLoading={aControlerLoading}
                />
                <StatCard
                    label="Contrôles effectués"
                    value={historique.length}
                    icon={ClipboardCheck}
                    accent="brand"
                    isLoading={historiqueLoading}
                />
                <StatCard
                    label="Conformes"
                    value={conformes}
                    icon={CheckCircle2}
                    accent="emerald"
                    isLoading={historiqueLoading}
                />
                <StatCard
                    label="Non conformes"
                    value={nonConformes}
                    icon={XCircle}
                    accent="rose"
                    isLoading={historiqueLoading}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
                <ChartCard
                    title="Résultat des contrôles"
                    type="donut"
                    series={donut.series}
                    options={donutOptions}
                    isLoading={historiqueLoading}
                    isEmpty={donut.total === 0}
                />
                <ChartCard
                    title="Contrôles par mois"
                    subtitle="6 derniers mois"
                    type="bar"
                    series={barres.series}
                    options={barOptions}
                    isLoading={historiqueLoading}
                    isEmpty={historique.length === 0}
                />
            </div>

            <RecentActivitiesList
                title="Demandes à contrôler"
                items={recentes}
                isLoading={aControlerLoading}
                emptyLabel="Aucune demande à contrôler"
            />
        </div>
    );
};

export default HomePage;
