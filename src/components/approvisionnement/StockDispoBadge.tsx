import React from "react";

interface StockDispoBadgeProps {
  quantite: number | null;
}

const StockDispoBadge: React.FC<StockDispoBadgeProps> = ({ quantite }) => {
  if (quantite === null) {
    return <span className='text-sm text-gray-500'>—</span>;
  }
  return (
    <span className='text-sm text-gray-700'>
      {quantite} {quantite === 1 ? "disponible" : "disponibles"}
    </span>
  );
};

export default StockDispoBadge;