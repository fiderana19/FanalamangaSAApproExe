import React, { useMemo, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { LoadingOutlined } from "@ant-design/icons";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HistoryNode from "./HistoryNode";
import { ACHAT_LANE, type HistoriqueItemInterface } from "./historiqueTypes";

const nodeTypes = { historique: HistoryNode };

const Y_GAP = 120;
const X_GAP = 260;
const HAUTEUR_FIXE = 520;
const HAUTEUR_MIN = 200;
const EMPTY: HistoriqueItemInterface[] = [];

interface Disposition {
  nodes: Node[];
  edges: Edge[];
  nbRangees: number;
}

const creerNoeud = (
  item: HistoriqueItemInterface,
  x: number,
  y: number,
): Node => ({
  id: item.id,
  type: "historique",
  position: { x, y },
  data: item as unknown as Record<string, unknown>,
  draggable: false,
  connectable: false,
  selectable: false,
});

const creerArete = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  type: "smoothstep",
  style: { stroke: "var(--color-brand-border)", strokeWidth: 1.5 },
});

const construireDispositionChaine = (
  liste: HistoriqueItemInterface[],
  espacement: number,
): Disposition => {
  const nodes = liste.map((item, index) =>
    creerNoeud(item, 0, index * espacement),
  );
  const edges = liste
    .slice(0, -1)
    .map((item, index) => creerArete(item.id, liste[index + 1].id));
  return { nodes, edges, nbRangees: liste.length };
};

const construireDispositionBranches = (
  liste: HistoriqueItemInterface[],
  espacement: number,
): Disposition => {
  const premiere = liste.findIndex((item) => !!item.lane);

  const achatExiste = liste.some((item) => item.lane === ACHAT_LANE);

  const bsmLanes: string[] = [];
  liste.forEach((item) => {
    if (
      item.lane &&
      item.lane !== ACHAT_LANE &&
      !bsmLanes.includes(item.lane)
    ) {
      bsmLanes.push(item.lane);
    }
  });

  if (
    premiere < 0 ||
    !achatExiste ||
    bsmLanes.length < 2 ||
    liste[premiere].lane === ACHAT_LANE
  ) {
    return construireDispositionChaine(liste, espacement);
  }

  const premierBsm = bsmLanes[0];
  const troncAvant = liste.slice(0, premiere);
  const suite = liste.slice(premiere);
  const premiereBranche = suite.filter(
    (item) => !item.lane || item.lane === premierBsm,
  );
  const secondeBranche = suite.filter(
    (item) => !!item.lane && item.lane !== premierBsm,
  );

  if (premiereBranche.length === 0 || secondeBranche.length === 0) {
    return construireDispositionChaine(liste, espacement);
  }

  const xTronc = X_GAP / 2;
  const yBranches = troncAvant.length * espacement;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  troncAvant.forEach((item, index) => {
    nodes.push(creerNoeud(item, xTronc, index * espacement));
  });
  troncAvant.slice(0, -1).forEach((item, index) => {
    edges.push(creerArete(item.id, troncAvant[index + 1].id));
  });

  premiereBranche.forEach((item, index) => {
    nodes.push(creerNoeud(item, 0, yBranches + index * espacement));
  });
  premiereBranche.slice(0, -1).forEach((item, index) => {
    edges.push(creerArete(item.id, premiereBranche[index + 1].id));
  });

  secondeBranche.forEach((item, index) => {
    nodes.push(creerNoeud(item, X_GAP, yBranches + index * espacement));
  });
  secondeBranche.slice(0, -1).forEach((item, index) => {
    edges.push(creerArete(item.id, secondeBranche[index + 1].id));
  });

  const racine = troncAvant[troncAvant.length - 1];
  if (racine) {
    edges.push(creerArete(racine.id, premiereBranche[0].id));
    edges.push(creerArete(racine.id, secondeBranche[0].id));
  }

  return {
    nodes,
    edges,
    nbRangees:
      troncAvant.length +
      Math.max(premiereBranche.length, secondeBranche.length),
  };
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  height: number | string;
  interactive?: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  height,
  interactive = false,
}) => (
  <div className="w-full" style={{ height }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.1, maxZoom: interactive ? undefined : 1 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      zoomOnScroll={interactive}
      panOnScroll={interactive}
      preventScrolling={interactive}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={16} color="var(--color-brand-border)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  </div>
);

interface HistoriqueFlowProps {
  titre?: string;
  items?: HistoriqueItemInterface[];
  isLoading?: boolean;
  isError?: boolean;
  vide?: string;
  hauteurAdaptative?: boolean;
  agrandissable?: boolean;
  espacement?: number;
  branches?: boolean;
}

const HistoriqueFlow: React.FC<HistoriqueFlowProps> = ({
  titre = "Historique",
  items,
  isLoading,
  isError,
  vide = "Aucun historique enregistré",
  hauteurAdaptative = false,
  agrandissable = false,
  espacement = Y_GAP,
  branches = false,
}) => {
  const [ouvert, setOuvert] = useState(false);
  const liste = items ?? EMPTY;

  const { nodes, edges, nbRangees } = useMemo(
    () =>
      branches
        ? construireDispositionBranches(liste, espacement)
        : construireDispositionChaine(liste, espacement),
    [liste, espacement, branches],
  );

  const hauteur = hauteurAdaptative
    ? Math.max(HAUTEUR_MIN, nbRangees * espacement)
    : HAUTEUR_FIXE;

  const aDonnees = !isLoading && !isError && liste.length > 0;

  return (
    <div className="panel p-5 lg:sticky lg:top-[84px]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-700">{titre}</h2>
        {agrandissable && aDonnees && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-gray-500 hover:text-gray-700"
            aria-label="Agrandir l'historique"
            title="Agrandir l'historique"
            onClick={() => setOuvert(true)}
          >
            <Maximize2 />
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6">
          <LoadingOutlined className="text-2xl text-brand" />
        </div>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Erreur de chargement de l'historique.
        </p>
      ) : liste.length === 0 ? (
        <p className="text-sm text-muted-foreground">{vide}</p>
      ) : (
        <FlowCanvas nodes={nodes} edges={edges} height={hauteur} />
      )}
      {agrandissable && (
        <Dialog open={ouvert} onOpenChange={setOuvert}>
          <DialogContent className="sm:max-w-5xl">
            <DialogHeader>
              <DialogTitle>{titre}</DialogTitle>
            </DialogHeader>
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              height="80vh"
              interactive
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HistoriqueFlow;
