import React from "react";
import { Check, X } from "lucide-react";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { LigneDemandeInterface } from "@/interfaces/Demande";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

interface RessourcesGrilleProps {
  lignes: LigneDemandeInterface[];
}

const getControleMark = (statut: string): React.ReactNode =>
  statut === "non_conforme" ? (
    <X className="size-4 text-red-600" strokeWidth={3} />
  ) : (
    <Check className="size-4 text-emerald-600" strokeWidth={3} />
  );

const RessourcesGrille: React.FC<RessourcesGrilleProps> = ({ lignes }) => {
  return (
    <div className="panel flex flex-col overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-brand-border">
        <h2 className="text-sm font-semibold text-gray-700">
          {pluriel(lignes.length, "Ressource contrôlée", "Ressources contrôlées")}
          <span className="ml-2 text-muted-foreground font-normal">
            ({lignes.length})
          </span>
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
              <th className="py-3 pr-4 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {lignes.length > 0 ? (
              lignes.map((ligne: LigneDemandeInterface) => {
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
                        <span className="text-muted-foreground">
                          Ressource inconnue
                        </span>
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
                    <td className="py-3 pr-4 whitespace-nowrap text-center">
                      {getControleMark(ligne.statutLigneDemande)}
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
                  Aucune ressource contrôlée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RessourcesGrille;