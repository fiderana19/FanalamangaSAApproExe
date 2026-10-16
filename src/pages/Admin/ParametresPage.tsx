import React from "react";
import { cardClassName } from "@/utils/ClassNames";
import GestionDonneesSection from "@/components/parametres/GestionDonneesSection";

const ParametresPage: React.FC = () => {
  return (
    <div className='min-h-[70vh] flex flex-col'>
      <div className='flex-1'>
        <div className={`${cardClassName} w-full`}>
          <GestionDonneesSection />
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;
