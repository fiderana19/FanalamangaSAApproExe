import React from "react";
import AideGuide from "@/components/aide/AideGuide";
import { AIDE_CONTENU } from "@/constants/Aide";

const AidePage: React.FC = () => (
    <AideGuide role='chef_service' sections={AIDE_CONTENU.chef_service} />
);

export default AidePage;
