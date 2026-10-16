import React, { useMemo } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { CheckCircle2, ClipboardCheck, PackageX, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import RessourcesGrille from "@/components/demandes/RessourcesGrille";
import { getRoleLabel } from "@/constants/Role";
import { getDirectionLabel } from "@/constants/Direction";
import { useGetControleDetail } from "@/hooks/useGetControleDetail";
import { formatDate } from "@/utils/Date";
import {
  ControleDetailInterface,
  LigneDemandeInterface,
  LigneDemandeStatutType,
} from "@/interfaces/Demande";

const STATUTS_AFFICHEES: LigneDemandeStatutType[] = [
  "en_bon_magasin",
  "controlee",
  "non_conforme",
];

const ControleViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: controle, isLoading, isError } = useGetControleDetail(id);

  const c = controle as ControleDetailInterface | undefined;

  const lignes = useMemo(
    () =>
      (c?.lignes ?? []).filter((ligne: LigneDemandeInterface) =>
        STATUTS_AFFICHEES.includes(ligne.statutLigneDemande),
      ),
    [c?.lignes],
  );

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingOutlined className="text-4xl text-brand" />
        </div>
      ) : isError || !c ? (
        <div className="flex justify-center py-16 text-center text-red-500">
          Une erreur est survenue lors du chargement du contrôle.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="w-full panel p-5 flex items-center gap-5">
            <div className="grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
              <h1 className="text-lg font-bold flex items-center gap-2">
                Contrôle de{" "}
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700">
                  {c.demande?.numeroDemande ?? "—"}
                </span>
              </h1>
              <span className="text-sm text-gray-500 truncate">
                {c.demande?.motif}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    c.statutControle === "conforme"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {c.statutControle === "conforme" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <PackageX className="size-3.5" />
                  )}
                  {c.statutControle === "conforme"
                    ? "Conforme"
                    : "Non conforme"}
                </span>
                {c.demande?.urgence && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                    <Zap className="size-4" /> Urgent
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 items-start lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-5">
              <div className="panel p-5">
                <h2 className="text-sm font-semibold mb-4 text-gray-700">
                  Informations de la demande
                </h2>
                <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Date demande
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(c.demande?.dateDemande)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Demandeur
                    </div>
                    <div className="text-sm text-gray-700">
                      {c.demande?.demandeur
                        ? `${c.demande.demandeur.nom ?? ""} ${c.demande.demandeur.prenom ?? ""}`.trim() || "—"
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Motif
                    </div>
                    <div className="text-sm text-gray-700">
                      {c.demande?.motif}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Direction
                    </div>
                    <div className="text-sm text-gray-700">
                      {getDirectionLabel(
                        c.demande?.demandeur?.service?.direction,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Service
                    </div>
                    <div className="text-sm text-gray-700">
                      {c.demande?.demandeur?.service
                        ? `${c.demande.demandeur.service.nomService ?? ""}${
                            c.demande.demandeur.service.lieuService
                              ? ` — ${c.demande.demandeur.service.lieuService}`
                              : ""
                          }`.trim()
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <RessourcesGrille lignes={lignes} />
            </div>

            <div className="panel p-5">
              <h2 className="text-sm font-semibold mb-4 text-gray-700">
                Fiche de contrôle
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Résultat
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.statutControle === "conforme"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {c.statutControle === "conforme" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <PackageX className="size-3.5" />
                      )}
                      {c.statutControle === "conforme"
                        ? "Conforme"
                        : "Non conforme"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Date du contrôle
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    {formatDate(c.dateControle)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Contrôleur
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    {c.utilisateur
                      ? `${c.utilisateur.nom ?? ""} ${c.utilisateur.prenom ?? ""}`.trim() || "—"
                      : "—"}
                    {c.utilisateur?.role && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {getRoleLabel(c.utilisateur.role)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Commentaire du contrôle
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    {c.commentaireControle || "Aucun commentaire"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControleViewPage;