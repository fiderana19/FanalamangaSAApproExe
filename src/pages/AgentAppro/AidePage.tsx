import React from "react";
import AideGuide from "@/components/aide/AideGuide";
import { AIDE_CONTENU } from "@/constants/Aide";

const AidePage: React.FC = () => (
    <AideGuide role='agent_appro' sections={AIDE_CONTENU.agent_appro} />
);

export default AidePage;
