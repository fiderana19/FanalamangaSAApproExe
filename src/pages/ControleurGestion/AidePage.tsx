import React from "react";
import AideGuide from "@/components/aide/AideGuide";
import { AIDE_CONTENU } from "@/constants/Aide";

const AidePage: React.FC = () => (
    <AideGuide
        role='controleur_gestion'
        sections={AIDE_CONTENU.controleur_gestion}
    />
);

export default AidePage;
