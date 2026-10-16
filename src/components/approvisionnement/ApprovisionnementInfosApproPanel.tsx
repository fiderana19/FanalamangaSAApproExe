import React from "react";
import { ApprovisionnementInterface } from "@/interfaces/Approvisionnement";
import UrgentBadge from "@/components/common/UrgentBadge";

interface ApprovisionnementInfosApproPanelProps {
  approvisionnement: ApprovisionnementInterface;
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='min-w-0'>
    <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>{label}</div>
    <div className='text-sm text-gray-700 truncate'>{children}</div>
  </div>
);

const ApprovisionnementInfosApproPanel: React.FC<ApprovisionnementInfosApproPanelProps> = ({
  approvisionnement,
}) => (
  <div className='panel p-6'>
    <div className='flex items-center gap-2 mb-4'>
      <h2 className='text-sm font-semibold text-gray-700'>Informations</h2>
      {approvisionnement.bonMagasin?.demande?.urgence && <UrgentBadge size='sm' />}
    </div>
    <div className='grid gap-x-8 gap-y-4 grid-cols-2'>
      <Field label='Objet'>{approvisionnement.bonMagasin?.objet || "—"}</Field>
      <Field label='Date approvisionnement'>
        {formatDate(approvisionnement.dateApprovisionnement) || "—"}
      </Field>
      <div className='col-span-2 min-w-0'>
        <div className='text-[11px] uppercase tracking-wider text-muted-foreground'>
          Commentaire
        </div>
        <div className='text-sm text-gray-700 truncate'>
          {approvisionnement.commentaireApprovisionnement?.trim()
            ? approvisionnement.commentaireApprovisionnement
            : "—"}
        </div>
      </div>
    </div>
  </div>
);

export default ApprovisionnementInfosApproPanel;
