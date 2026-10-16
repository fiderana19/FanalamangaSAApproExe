import React from "react";
import {
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ClipboardList, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageActionBar from "@/components/ui/PageActionBar";
import DemandeStatutBadge from "@/components/status/DemandeStatutBadge";
import LigneStatutBadge from "@/components/status/LigneStatutBadge";
import HistoriqueDemande from "@/components/demandes/HistoriqueDemande";
import DemandeTraitementsDetails from "@/components/demandes/DemandeTraitementsDetails";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { getDirectionLabel } from "@/constants/Direction";
import { useGetDemande } from "@/hooks/useGetDemande";
import { formatDate } from "@/utils/Date";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";
import { LigneDemandeInterface } from "@/interfaces/Demande";

const DemandeViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError } = useGetDemande(id);

  const estAControler = demande?.statutActuelDemande === "validee";
  const lignesValidees = (demande?.lignes ?? []).filter(
    (ligne: LigneDemandeInterface) =>
      ligne.statutLigneDemande === "validee" ||
      ligne.statutLigneDemande === "controlee",
  );

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

          <PageActionBar>
            {estAControler && (
              <Button
                type="button"
                variant="brand"
                onClick={() =>
                  navigate(
                    `/controleur_gestion/demande/controle/${demande._id}`,
                  )
                }
                className="shrink-0 shadow-md"
              >
                <CheckCircleOutlined /> Contrôler
              </Button>
            )}
          </PageActionBar>

          <div className="mt-5 grid grid-cols-1 gap-5 items-start lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-5">
              <div className="panel p-5">
                <h2 className="text-sm font-semibold mb-4 text-gray-700">
                  Informations
                </h2>

                <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Date demande
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(demande.dateDemande)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Demandeur
                    </div>
                    <div className="text-sm text-gray-700">
                      {demande.demandeur
                        ? `${demande.demandeur.nom ?? ""} ${demande.demandeur.prenom ?? ""}`.trim()
                        : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Motif
                    </div>
                    <div className="text-sm text-gray-700">{demande.motif}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Direction
                    </div>
                    <div className="text-sm text-gray-700">
                      {getDirectionLabel(demande.demandeur?.service?.direction)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Service
                    </div>
                    <div className="text-sm text-gray-700">
                      {demande.demandeur?.service
                        ? `${demande.demandeur.service.nomService ?? ""}${
                            demande.demandeur.service.lieuService
                              ? ` — ${demande.demandeur.service.lieuService}`
                              : ""
                          }`.trim()
                        : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Dernier traitement
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(demande.dateDernierTraitement ?? undefined) ||
                        "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel flex flex-col overflow-hidden rounded-lg">
                <div className="flex items-center px-5 py-4 border-b border-brand-border">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {pluriel(lignesValidees.length, "Ressource validée de la demande", "Ressources validées de la demande")}{" "}
                    {lignesValidees.length > 0 && (
                      <span className="ml-1 text-muted-foreground font-normal">
                        ({lignesValidees.length})
                      </span>
                    )}
                  </h2>
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
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignesValidees.length > 0 ? (
                        lignesValidees.map(
                          (ligne: LigneDemandeInterface) => {
                            const ressource = getRessource(ligne.ressource);
                            return (
                              <tr
                                key={ligne._id}
                                className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0"
                              >
                                <td className="px-4 py-3">
                                  {ressource ? (
                                    <div className="flex flex-col gap-1">
                                      <span className="font-medium text-foreground">
                                        <span className="mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                                          {ressource.reference}
                                        </span>
                                        {ressource.designationRessource}
                                      </span>
                                      <RessourceCategorieBadge
                                        categorie={ressource.categorie}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground" />
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">
                                  {ligne.quantite}
                                  {ressource?.unite && (
                                    <span className="ml-1 font-normal text-gray-500">
                                      {getUniteLabel(ressource.unite)}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 pr-4 whitespace-nowrap">
                                  <LigneStatutBadge
                                    statut={ligne.statutLigneDemande}
                                  />
                                </td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td
                            colSpan={3}
                            className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                          >
                            Aucune ressource validée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <DemandeTraitementsDetails demandeId={demande._id} />
              <HistoriqueDemande demandeId={demande._id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DemandeViewPage;