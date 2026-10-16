import { type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface QuickAction {
    label: string;
    to: string;
    icon: LucideIcon;
    variant?: "brand" | "outline" | "secondary";
}

interface QuickActionsProps {
    title?: string;
    actions: QuickAction[];
}

export const QuickActions = ({ title = "Actions rapides", actions }: QuickActionsProps) => {
    const navigate = useNavigate();

    return (
        <div className='panel h-fit self-start p-5'>
            <h3 className='mb-4 text-sm font-semibold text-gray-800'>{title}</h3>
            <div className='flex flex-wrap content-start gap-2'>
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Button
                            key={`${action.to}-${action.label}`}
                            variant={action.variant ?? "outline"}
                            onClick={() => navigate(action.to)}
                        >
                            <Icon />
                            {action.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
