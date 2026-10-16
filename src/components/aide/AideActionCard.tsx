import React from "react";
import { Lightbulb } from "lucide-react";
import AideTexte from "@/components/aide/AideTexte";
import { AideAction } from "@/interfaces/Aide";

interface AideActionCardProps {
    action: AideAction;
}

const AideActionCard: React.FC<AideActionCardProps> = ({ action }) => (
    <div className='rounded-lg border border-brand-border bg-white p-4'>
        <h4 className='text-sm font-bold text-gray-800'>{action.titre}</h4>
        <p className='mt-1 text-sm text-brand-muted'>
            <AideTexte texte={action.description} />
        </p>
        <ol className='mt-3 space-y-1.5'>
            {action.etapes.map((etape, index) => (
                <li key={index} className='flex gap-2.5 text-sm text-gray-700'>
                    <span className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#e9f5ee] text-[11px] font-bold text-brand'>
                        {index + 1}
                    </span>
                    <span>
                        <AideTexte texte={etape} />
                    </span>
                </li>
            ))}
        </ol>
        {action.astuce ? (
            <div className='mt-3 flex gap-2 rounded-md bg-[#e9f5ee] px-3 py-2 text-sm text-brand'>
                <Lightbulb className='mt-0.5 size-4 shrink-0' />
                <span>
                    <AideTexte texte={action.astuce} />
                </span>
            </div>
        ) : null}
    </div>
);

export default AideActionCard;
