import React from "react";
import { ApprovisionnementDemandeRef } from "@/interfaces/Approvisionnement";
import { getDirectionLabel } from "@/constants/Direction";

interface ApprovisionnementInfosDemandePanelProps {
  demandeur: ApprovisionnementDemandeRef["demandeur"];
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='min-w-0'>
    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>{label}</div>
    <div className='text-sm text-gray-700 truncate'>{children}</div>
  </div>
);

const ApprovisionnementInfosDemandePanel: React.FC<ApprovisionnementInfosDemandePanelProps> = ({
  demandeur,
}) => {
  const service = demandeur?.service ?? null;

  return (
    <div className='panel p-6'>
      <h2 className='text-sm font-semibold mb-4 text-gray-700'>Demandeur</h2>
      <div className='grid gap-x-8 gap-y-4 grid-cols-2'>
        <Field label='Direction'>{getDirectionLabel(service?.direction) || "—"}</Field>
        <Field label='Service'>
          {[service?.sigleService, service?.nomService].filter(Boolean).join(" - ") || "—"}
        </Field>
        <Field label='Affectation'>{service?.lieuService ?? "—"}</Field>
        <Field label='Demandeur'>
          {demandeur ? `${demandeur.nom} ${demandeur.prenom}` : "—"}
        </Field>
      </div>
    </div>
  );
};

export default ApprovisionnementInfosDemandePanel;
