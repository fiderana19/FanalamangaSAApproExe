import React from "react";
import AideGuide from "@/components/aide/AideGuide";
import { AIDE_CONTENU } from "@/constants/Aide";

const AidePage: React.FC = () => (
    <AideGuide role='employe' sections={AIDE_CONTENU.employe} />
);

export default AidePage;
