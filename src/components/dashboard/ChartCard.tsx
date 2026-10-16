import {
    ApexChart,
    type ApexChartOptions,
    type ApexChartSeries,
    type ApexChartType,
} from "./ApexChart";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    type: ApexChartType;
    series: ApexChartSeries;
    options?: ApexChartOptions;
    height?: number;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyLabel?: string;
}

export const ChartCard = ({
    title,
    subtitle,
    type,
    series,
    options,
    height = 240,
    isLoading,
    isEmpty,
    emptyLabel = "Aucune donnée disponible",
}: ChartCardProps) => {
    return (
        <div className='panel p-5'>
            <div className='mb-4'>
                <h3 className='text-sm font-semibold text-gray-800'>{title}</h3>
                {subtitle && <p className='text-xs text-brand-muted'>{subtitle}</p>}
            </div>

            {isLoading ? (
                <div className='animate-pulse rounded-lg bg-gray-100' style={{ height }} />
            ) : isEmpty ? (
                <div
                    className='grid place-items-center text-sm text-brand-muted'
                    style={{ height }}
                >
                    {emptyLabel}
                </div>
            ) : (
                <ApexChart type={type} series={series} options={options} height={height} />
            )}
        </div>
    );
};
