import React from "react";
import { useGetTraitementsAppro } from "@/hooks/useGetTraitementsAppro";
import { TraitementApproInterface } from "@/interfaces/Approvisionnement";
import HistoriqueFlow from "@/components/history/HistoriqueFlow";
import { construireItemsAppro } from "@/components/approvisionnement/historiqueApproItems";

interface HistoriqueApproProps {
  approvisionnementId?: string;
}

const HistoriqueAppro: React.FC<HistoriqueApproProps> = ({
  approvisionnementId,
}) => {
  const {
    data: traitementsAppro,
    isLoading: chargementAppro,
    isError: erreurAppro,
  } = useGetTraitementsAppro(approvisionnementId);

  const items = construireItemsAppro(
    (traitementsAppro ?? []) as TraitementApproInterface[],
  );

  return (
    <HistoriqueFlow
      items={items}
      isLoading={chargementAppro}
      isError={erreurAppro}
      agrandissable
      branches
      espacement={180}
    />
  );
};

export default HistoriqueAppro;
