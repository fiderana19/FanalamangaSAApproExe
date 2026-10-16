import { Boxes, FilePlus2, Package, ShoppingCart, Truck, Upload } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { QuickActions, type QuickAction } from "@/components/dashboard/QuickActions";
import { type ApexChartOptions } from "@/components/dashboard/ApexChart";
import { useGetApprovisionnements } from "@/hooks/useGetApprovisionnements";
import { useGetRessources } from "@/hooks/useGetRessources";
import { useGetDemandeAchats } from "@/hooks/useGetDemandeAchats";
import { useGetBonSorties } from "@/hooks/useGetBonSorties";
import { useGetLivraisons } from "@/hooks/useGetLivraisons";
import { ApprovisionnementInterface } from "@/interfaces/Approvisionnement";
import { getApprovisionnementStatutDisplayLabel } from "@/constants/ApprovisionnementStatut";
import { RessourceInterface } from "@/interfaces/Ressource";
import { DemandeAchatInterface } from "@/interfaces/DemandeAchat";
import { BonSortieInterface } from "@/interfaces/BonSortie";
import { LivraisonInterface } from "@/interfaces/Livraison";
import { getCategorieLabel } from "@/constants/RessourceCategorie";
import { CHART_BRAND, CHART_COLORS, CHART_GRID, getStatutChartColor } from "@/constants/Dashboard";
import { compterPar, construireDonut } from "@/utils/Dashboard";

const actions: QuickAction[] = [
    { label: "Nouvelle ressource", to: "/agent_appro/ressource/create", icon: FilePlus2, variant: "brand" },
    { label: "Importer des ressources", to: "/agent_appro/ressource/import", icon: Upload },
];

const HomePage = () => {
    const { data: approData, isLoading: approLoading } = useGetApprovisionnements();
    const { data: ressourcesData, isLoading: ressourcesLoading } = useGetRessources();
    const { data: demandesAchatData, isLoading: demandesAchatLoading } = useGetDemandeAchats();
    const { data: bonsSortieData, isLoading: bonsSortieLoading } = useGetBonSorties();
    const { data: livraisonsData, isLoading: livraisonsLoading } = useGetLivraisons();

    const approvisionnements = (approData as ApprovisionnementInterface[] | undefined) ?? [];
    const ressources = (ressourcesData as RessourceInterface[] | undefined) ?? [];
    const demandesAchat = (demandesAchatData as DemandeAchatInterface[] | undefined) ?? [];
    const bonsSortie = (bonsSortieData as BonSortieInterface[] | undefined) ?? [];
    const livraisons = (livraisonsData as LivraisonInterface[] | undefined) ?? [];

    const approParStatut = compterPar(approvisionnements, (appro) =>
        getApprovisionnementStatutDisplayLabel(appro.statutApprovisionnement)
    );
    const ressourcesParCategorie = compterPar(ressources, (ressource) => ressource.categorie);
    const achatsParStatut = compterPar(demandesAchat, (achat) => achat.statutActuelDemandeAchat);

    const approDonut = construireDonut(approParStatut, (cle) => cle, getStatutChartColor);
    const categorieDonut = construireDonut(
        ressourcesParCategorie,
        getCategorieLabel,
        (_cle, index) => CHART_COLORS[index % CHART_COLORS.length]
    );

    const donutOptions: ApexChartOptions = {
        labels: approDonut.labels,
        colors: approDonut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    const categorieDonutOptions: ApexChartOptions = {
        labels: categorieDonut.labels,
        colors: categorieDonut.colors,
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        stroke: { width: 2 },
        plotOptions: { pie: { donut: { size: "62%" } } },
    };

    const achatsOptions: ApexChartOptions = {
        xaxis: { categories: ["En cours", "Terminé"] },
        colors: [CHART_BRAND],
        plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
        dataLabels: { enabled: false },
        grid: { borderColor: CHART_GRID },
    };
    const achatsSeries = [{ name: "Demandes d'achat", data: [achatsParStatut["en_cours"] ?? 0, achatsParStatut["termine"] ?? 0] }];

    return (
        <div className='space-y-5'>
            <DashboardHeader />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5'>
                <StatCard
                    label="Appro. en cours"
                    value={approvisionnements.filter((appro) => appro.statutApprovisionnement !== "recu").length}
                    icon={Boxes}
                    accent="brand"
                    isLoading={approLoading}
                />
                <StatCard
                    label="Ressources"
                    value={ressources.length}
                    icon={Package}
                    accent="blue"
                    isLoading={ressourcesLoading}
                />
                <StatCard
                    label="Achats en cours"
                    value={achatsParStatut["en_cours"] ?? 0}
                    icon={ShoppingCart}
                    accent="amber"
                    isLoading={demandesAchatLoading}
                />
                <StatCard
                    label="Bons de sortie"
                    value={bonsSortie.length}
                    icon={Package}
                    accent="teal"
                    isLoading={bonsSortieLoading}
                />
                <StatCard
                    label="Livraisons en cours"
                    value={livraisons.filter((livraison) => livraison.statutLivraison === "en_cours").length}
                    icon={Truck}
                    accent="sky"
                    isLoading={livraisonsLoading}
                />
            </div>

            <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
                <ChartCard
                    title="Approvisionnements par statut"
                    type="donut"
                    series={approDonut.series}
                    options={donutOptions}
                    isLoading={approLoading}
                    isEmpty={approDonut.total === 0}
                />
                <ChartCard
                    title="Ressources par catégorie"
                    type="donut"
                    series={categorieDonut.series}
                    options={categorieDonutOptions}
                    isLoading={ressourcesLoading}
                    isEmpty={categorieDonut.total === 0}
                />
                <ChartCard
                    title="Demandes d'achat"
                    type="bar"
                    series={achatsSeries}
                    options={achatsOptions}
                    isLoading={demandesAchatLoading}
                    isEmpty={demandesAchat.length === 0}
                />
            </div>

            <QuickActions actions={actions} />
        </div>
    );
};

export default HomePage;
