import React, { useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ClipboardList, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageActionBar from "@/components/ui/PageActionBar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DemandeStatutBadge from "@/components/status/DemandeStatutBadge";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetDemande } from "@/hooks/useGetDemande";
import { useControlerDemande } from "@/hooks/useControlerDemande";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";
import {
  ControlerDemandeInterface,
  LigneDemandeInterface,
} from "@/interfaces/Demande";

const DemandeControlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError } = useGetDemande(id);
  const { mutateAsync: controler, isPending } = useControlerDemande();

  const lignes: LigneDemandeInterface[] = (demande?.lignes ?? []).filter(
    (ligne: LigneDemandeInterface) => ligne.statutLigneDemande === "validee",
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [commentaire, setCommentaire] = useState("");

  const toutesSelectionnees =
    lignes.length > 0 && lignes.every((ligne) => selected.has(ligne._id));

  const toggleLigne = (ligneId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ligneId)) {
        next.delete(ligneId);
      } else {
        next.add(ligneId);
      }
      return next;
    });
  };

  const basculerTout = () => {
    setSelected(
      toutesSelectionnees
        ? new Set()
        : new Set(lignes.map((ligne) => ligne._id)),
    );
  };

  const handleControler = async () => {
    if (!demande) {
      return;
    }
    const data: ControlerDemandeInterface = {
      lignesConformes: Array.from(selected),
    };
    const texte = commentaire.trim();
    if (texte) {
      data.commentaireControle = texte;
    }
    try {
      await controler({ id: demande._id, data });
      navigate(`/controleur_gestion/demande/view/${demande._id}`);
    } catch {
      return;
    }
  };

  return (
    <div className="flex flex-col pb-14">
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingOutlined className="text-4xl text-brand" />
        </div>
      ) : isError || !demande ? (
        <div className="flex justify-center py-16 text-center text-red-500">
          Une erreur est survenue lors du chargement de la demande.
        </div>
      ) : (
        <>
          <div className="w-full panel p-5 flex items-center gap-5">
            <div className="grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
              <h1 className="text-lg font-bold truncate flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700">
                  {demande.numeroDemande}
                </span>
                <span className="truncate">{demande.motif}</span>
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <DemandeStatutBadge
                  statut={demande.statutActuelDemande}
                  size="md"
                />
                {demande.urgence && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                    <Zap className="size-4" /> Urgent
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 panel flex flex-col overflow-hidden rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Sélectionnez les ressources conformes
                <span className="ml-2 text-muted-foreground font-normal">
                  ({selected.size}/{lignes.length} {pluriel(selected.size, "sélectionnée", "sélectionnées")})
                </span>
              </h2>
              {lignes.length > 0 && (
                <button
                  type="button"
                  onClick={basculerTout}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {toutesSelectionnees
                    ? "Tout désélectionner"
                    : "Tout sélectionner"}
                </button>
              )}
            </div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 sticky top-0 z-10">
                  <tr className="border-b border-brand-border">
                    <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">
                      Ressource
                    </th>
                    <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">
                      Quantité
                    </th>
                    <th className="py-3 pr-4 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">
                      Unité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.length > 0 ? (
                    lignes.map((ligne: LigneDemandeInterface) => {
                      const ressource = getRessource(ligne.ressource);
                      const isSelected = selected.has(ligne._id);
                      return (
                        <tr
                          key={ligne._id}
                          className={`border-b border-[#f1f5f9] border-l-2 transition-colors last:border-b-0 ${
                            isSelected
                              ? "border-l-[#16a34a] bg-[#e9f5ee]/40"
                              : "border-l-transparent hover:bg-muted/40"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLigne(ligne._id)}
                                className="mt-1 size-4 shrink-0 accent-green-600 border rounded-md"
                              />
                              {ressource ? (
                                <span className="flex flex-col gap-1">
                                  <span className="font-medium text-foreground">
                                    <span className="mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                                      {ressource.reference}
                                    </span>
                                    {ressource.designationRessource}
                                  </span>
                                  <RessourceCategorieBadge
                                    categorie={ressource.categorie}
                                  />
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Ressource inconnue
                                </span>
                              )}
                            </label>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">
                            {ligne.quantite}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            {ressource?.unite ? (
                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                {getUniteLabel(ressource.unite)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground" />
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <td
                        colSpan={3}
                        className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                      >
                        Aucune ressource validée sur cette demande
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 panel p-5">
            <Label
              htmlFor="commentaire-controle"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              Commentaire (facultatif)
            </Label>
            <Textarea
              id="commentaire-controle"
              rows={3}
              maxLength={500}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Précisions sur le contrôle…"
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">
              {commentaire.length}/500
            </div>
          </div>

          <PageActionBar>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/controleur_gestion/demande/view/${demande._id}`)
              }
              disabled={isPending}
              className="shrink-0 shadow-md"
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant={selected.size === 0 ? "destructive" : "brand"}
              onClick={handleControler}
              disabled={isPending || lignes.length === 0}
              className="shrink-0 shadow-md"
            >
              {isPending && <LoadingOutlined />}
              {isPending
                ? "Enregistrement…"
                : selected.size === 0
                  ? "Non conforme"
                  : "Conforme"}
              {!isPending &&
                (selected.size === 0 ? (
                  <CloseCircleOutlined />
                ) : (
                  <CheckCircleOutlined />
                ))}
            </Button>
          </PageActionBar>
        </>
      )}
    </div>
  );
};

export default DemandeControlePage;