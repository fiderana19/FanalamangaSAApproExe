import { type LucideIcon } from "lucide-react";

export type StatAccent =
    | "brand"
    | "amber"
    | "emerald"
    | "blue"
    | "rose"
    | "violet"
    | "sky"
    | "teal"
    | "orange"
    | "indigo"
    | "gray";

const ACCENT_STYLES: Record<StatAccent, { bg: string; text: string }> = {
    brand: { bg: "bg-emerald-50", text: "text-brand" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    rose: { bg: "bg-rose-50", text: "text-rose-600" },
    violet: { bg: "bg-violet-50", text: "text-violet-600" },
    sky: { bg: "bg-sky-50", text: "text-sky-600" },
    teal: { bg: "bg-teal-50", text: "text-teal-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
    gray: { bg: "bg-gray-50", text: "text-gray-600" },
};

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    accent?: StatAccent;
    hint?: string;
    isLoading?: boolean;
    onClick?: () => void;
}

export const StatCard = ({
    label,
    value,
    icon: Icon,
    accent = "brand",
    hint,
    isLoading,
    onClick,
}: StatCardProps) => {
    const styles = ACCENT_STYLES[accent];

    const content = (
        <>
            <div
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${styles.bg} ${styles.text}`}
            >
                <Icon className='size-5' />
            </div>
            <div className='min-w-0'>
                <p className='truncate text-xs font-medium text-brand-muted'>{label}</p>
                {isLoading ? (
                    <div className='mt-1 h-7 w-12 animate-pulse rounded bg-gray-100' />
                ) : (
                    <p className='text-2xl font-bold text-gray-800'>{value}</p>
                )}
                {hint && <p className='truncate text-xs text-brand-muted'>{hint}</p>}
            </div>
        </>
    );

    if (onClick) {
        return (
            <button
                type='button'
                onClick={onClick}
                className='panel flex w-full items-center gap-4 p-4 text-left transition hover:border-brand hover:shadow-sm'
            >
                {content}
            </button>
        );
    }

    return <div className='panel flex items-center gap-4 p-4'>{content}</div>;
};
