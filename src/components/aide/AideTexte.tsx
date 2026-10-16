import React from "react";
import { Link } from "react-router-dom";

interface AideTexteProps {
    texte: string;
}

const MOTIF_LIEN = /\[([^\]]+)\]\(([^)]+)\)/g;

const AideTexte: React.FC<AideTexteProps> = ({ texte }) => {
    const motif = new RegExp(MOTIF_LIEN.source, "g");
    const noeuds: React.ReactNode[] = [];
    let dernierIndex = 0;
    let correspondance: RegExpExecArray | null;

    while ((correspondance = motif.exec(texte)) !== null) {
        if (correspondance.index > dernierIndex) {
            noeuds.push(texte.slice(dernierIndex, correspondance.index));
        }
        noeuds.push(
            <Link
                key={`${correspondance[2]}-${correspondance.index}`}
                to={correspondance[2]}
                className='font-medium text-brand underline underline-offset-2 hover:text-brand-2'
            >
                {correspondance[1]}
            </Link>,
        );
        dernierIndex = correspondance.index + correspondance[0].length;
    }

    if (dernierIndex < texte.length) {
        noeuds.push(texte.slice(dernierIndex));
    }

    return <>{noeuds}</>;
};

export default AideTexte;
