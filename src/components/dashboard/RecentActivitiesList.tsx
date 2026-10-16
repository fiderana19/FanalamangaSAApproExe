import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface RecentActivityItem {
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
    to: string;
}

interface RecentActivitiesListProps {
    title: string;
    items: RecentActivityItem[];
    isLoading?: boolean;
    emptyLabel?: string;
}

export const RecentActivitiesList = ({
    title,
    items,
    isLoading,
    emptyLabel = "Aucune activité récente",
}: RecentActivitiesListProps) => {
    return (
        <div className='panel p-5'>
            <h3 className='mb-4 text-sm font-semibold text-gray-800'>{title}</h3>

            {isLoading ? (
                <div className='space-y-3'>
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className='h-12 animate-pulse rounded-lg bg-gray-100'
                        />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className='py-6 text-center text-sm text-brand-muted'>{emptyLabel}</p>
            ) : (
                <ul className='divide-y divide-brand-border'>
                    {items.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.to}
                                className='flex items-center justify-between gap-3 py-3 transition hover:text-brand'
                            >
                                <div className='min-w-0'>
                                    <p className='truncate text-sm font-medium text-gray-800'>
                                        {item.title}
                                    </p>
                                    {item.subtitle && (
                                        <p className='truncate text-xs text-brand-muted'>
                                            {item.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className='flex shrink-0 items-center gap-2'>
                                    {item.meta && (
                                        <span className='text-xs text-brand-muted'>
                                            {item.meta}
                                        </span>
                                    )}
                                    <ChevronRight className='size-4 text-brand-muted' />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
