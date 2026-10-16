import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShoppingBag, ShoppingCart } from "lucide-react";
import SectionItem from "@/components/ui/SectionItem";

const HistoriqueSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-bold text-foreground'>Historique</h2>
      <p className='text-sm text-gray-600'>
        Consultez l’historique de tous les traitements effectués sur les
        demandes, les approvisionnements et les achats.
      </p>

      <div className='flex flex-col gap-3'>
        <SectionItem
          icon={<FileText className='size-6' />}
          title='Demande'
          description='Liste de tous les traitements effectués sur les demandes.'
          onClick={() => navigate("/agent_appro/historique/demande")}
        />

        <SectionItem
          icon={<ShoppingCart className='size-6' />}
          title='Approvisionnement'
          description='Liste de tous les traitements effectués sur les approvisionnements.'
          onClick={() => navigate("/agent_appro/historique/appro")}
        />

        <SectionItem
          icon={<ShoppingBag className='size-6' />}
          title='Achat'
          description='Liste de tous les traitements effectués sur les achats.'
          onClick={() => navigate("/agent_appro/historique/achat")}
        />
      </div>
    </div>
  );
};

export default HistoriqueSection;