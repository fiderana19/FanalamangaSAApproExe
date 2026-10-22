import React, { useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDemandeAchats } from "@/hooks/useGetDemandeAchats";
import { DemandeAchatInterface } from "@/interfaces/DemandeAchat";
import {
  DEMANDE_ACHAT_STATUTS,
  getDemandeAchatStatutLabel,
} from "@/constants/DemandeAchatStatut";
import DemandeAchatStatutBadge from "@/components/status/DemandeAchatStatutBadge";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;
const DEMANDE_ACHAT_ROUTE = "/agent_appro/demande-achat";

const DemandeAchatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: demandeAchats, isLoading, isError } = useGetDemandeAchats();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterDemandeAchat = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (demandeAchat: DemandeAchatInterface) =>
    !searchTerm.trim() ||
    [
      demandeAchat.numeroDemandeAchat,
      demandeAchat.approvisionnement?.numeroApprovisionnement,
      demandeAchat.approvisionnement?.bonMagasin?.numeroBonMagasin,
      demandeAchat.approvisionnement?.bonMagasin?.objet,
      demandeAchat.approvisionnement?.bonMagasin?.demande?.numeroDemande,
      demandeAchat.approvisionnement?.bonMagasin?.demande?.demandeur?.nom,
      demandeAchat.approvisionnement?.bonMagasin?.demande?.demandeur?.prenom,
      ...(demandeAchat.lignes ?? []).map(
        (ligne) =>
          `${ligne.ressource?.reference ?? ""} ${ligne.ressource?.designationRessource ?? ""}`,
      ),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredDemandeAchats = (
    filterRef
      ? (demandeAchats ?? []).filter(
          (demandeAchat: DemandeAchatInterface) =>
            demandeAchat.statutActuelDemandeAchat === filterText,
        )
      : demandeAchats ?? []
  ).filter(matchesSearch);

  const sortedDemandeAchats = [...filteredDemandeAchats].sort(
    (a: DemandeAchatInterface, b: DemandeAchatInterface) =>
      sortDateDir === "asc"
        ? new Date(a.dateDemandeAchat).getTime() -
          new Date(b.dateDemandeAchat).getTime()
        : new Date(b.dateDemandeAchat).getTime() -
          new Date(a.dateDemandeAchat).getTime(),
  );

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedDemandeAchats.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDemandeAchats = sortedDemandeAchats.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedDemandeAchats.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedDemandeAchats.length);

  const openDemandeAchat = (demandeAchat: DemandeAchatInterface) => {
    navigate(`${DEMANDE_ACHAT_ROUTE}/view/${demandeAchat._id}`);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
        pages.push(i);
      }
    }
    const items: Array<number | "..."> = [];
    let prev = 0;
    for (const p of pages) {
      if (p - prev > 1) items.push("...");
      items.push(p);
      prev = p;
    }
    return items;
  };

  const colCount = 6;

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative shrink-0">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Recherche par demande, approvisionnement ou ressource"
            className="w-80 border-[#d9dee5] pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterDemandeAchat(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className="w-56 shrink-0 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {DEMANDE_ACHAT_STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {getDemandeAchatStatutLabel(statut)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="panel flex flex-col overflow-hidden rounded-lg">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr className="border-b border-brand-border">
                <th
                  className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground cursor-pointer select-none"
                  onClick={toggleSortDate}
                >
                  <span className="inline-flex items-center gap-1">
                    Date
                    {sortDateDir === "asc" ? (
                      <ChevronUp className="size-3.5 text-brand" />
                    ) : (
                      <ChevronDown className="size-3.5 text-brand" />
                    )}
                  </span>
                </th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° demande d'achat</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Approvisionnement</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Ressources</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="py-3 pr-4 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap"
                  >
                    <LoadingOutlined className="text-2xl text-brand" />
                  </td>
                </tr>
              ) : isError ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-red-500"
                  >
                    Une erreur est survenue lors du chargement des demandes d'achat.
                  </td>
                </tr>
              ) : sortedDemandeAchats.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucune demande d'achat trouvée
                  </td>
                </tr>
              ) : (
                paginatedDemandeAchats.map((demandeAchat: DemandeAchatInterface) => {
                  const appro = demandeAchat.approvisionnement;
                  const demandeur = appro?.bonMagasin?.demande?.demandeur;
                  return (
                    <tr
                      key={demandeAchat._id}
                      onClick={() => openDemandeAchat(demandeAchat)}
                      className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors last:border-b-0 hover:bg-[#e9f5ee]/40 hover:border-l-brand cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(demandeAchat.dateDemandeAchat)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                          {demandeAchat.numeroDemandeAchat}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {appro ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-gray-700">
                              {appro.numeroApprovisionnement}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                              {demandeur
                                ? `${demandeur.nom} ${demandeur.prenom}`
                                : appro.bonMagasin?.objet ?? "—"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                          {demandeAchat.lignes?.length ?? 0}{" "}
                          {pluriel(demandeAchat.lignes?.length ?? 0, "ressource", "ressources")}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <DemandeAchatStatutBadge
                          statut={demandeAchat.statutActuelDemandeAchat}
                        />
                      </td>
                      <td className="pr-4 py-3">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDemandeAchat(demandeAchat);
                            }}
                            className="gap-2 text-gray-500 hover:text-brand hover:bg-[#e9f5ee]"
                          >
                            <ClipboardList className="size-4" />
                            Voir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {sortedDemandeAchats.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedDemandeAchats.length}{" "}
              {pluriel(sortedDemandeAchats.length, "demande d'achat", "demandes d'achat")}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
                className="gap-0 px-2"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {renderPageNumbers().map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-brand-muted"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={item === safePage ? "brand" : "outline"}
                    onClick={() => goToPage(item)}
                    className="min-w-8 px-2"
                  >
                    {item}
                  </Button>
                ),
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => goToPage(safePage + 1)}
                className="gap-0 px-2"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DemandeAchatsPage;
