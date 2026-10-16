import React from "react";
import { cardClassName } from "@/utils/ClassNames";
import HistoriqueSection from "@/components/historique/HistoriqueSection";

const HistoriquePage: React.FC = () => {
  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1'>
        <div className={`${cardClassName} w-full`}>
          <HistoriqueSection />
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;