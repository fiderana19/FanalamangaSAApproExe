import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { HistoriqueItemInterface } from "./historiqueTypes";

const HistoryNode: React.FC<NodeProps> = ({ data }) => {
  const item = data as unknown as HistoriqueItemInterface;
  const Icon = item.meta.icon;

  return (
    <div className="w-[210px] rounded-lg border border-brand-border bg-white px-3 py-2.5 shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-1.5 !border-none !bg-brand-border"
      />
      <div className="flex flex-col gap-1">
        <span
          className={`inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.meta.badge}`}
        >
          {Icon && <Icon className="size-3.5" />}
          {item.titre}
        </span>
        {item.sousTitre && (
          <span className="text-sm font-medium text-foreground">
            {item.sousTitre}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{item.date}</span>
        {item.commentaire && (
          <p className="text-xs text-gray-700">{item.commentaire}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-1.5 !border-none !bg-brand-border"
      />
    </div>
  );
};

export default HistoryNode;
