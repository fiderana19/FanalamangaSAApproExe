import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";

export type ApexChartType = NonNullable<
    NonNullable<ApexCharts.ApexOptions["chart"]>["type"]
>;
export type ApexChartSeries = ApexCharts.ApexOptions["series"];
export type ApexChartOptions = ApexCharts.ApexOptions;

interface ApexChartProps {
    type: ApexChartType;
    series: ApexChartSeries;
    options?: ApexChartOptions;
    height?: number;
}

export const ApexChart = ({ type, series, options, height = 240 }: ApexChartProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const propsRef = useRef({ type, series, options, height });
    propsRef.current = { type, series, options, height };
    const signature = JSON.stringify({ type, series, options, height });

    useEffect(() => {
        if (!containerRef.current) return;

        const { type: chartType, series: chartSeries, options: chartOptions, height: chartHeight } =
            propsRef.current;

        const chart = new ApexCharts(containerRef.current, {
            ...chartOptions,
            chart: {
                toolbar: { show: false },
                fontFamily: "inherit",
                background: "transparent",
                ...chartOptions?.chart,
                type: chartType,
                height: chartHeight,
            },
            series: chartSeries,
        });

        chart.render().catch(() => undefined);

        return () => {
            chart.destroy();
        };
    }, [signature]);

    return <div ref={containerRef} />;
};
