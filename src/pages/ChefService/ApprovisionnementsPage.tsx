import React, { useState } from "react";
import {
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useGetApprovisionnementsService } from "@/hooks/useGetApprovisionnementsService";
import { ApprovisionnementInterface } from "@/interfaces/Approvisionnement";
import {
  APPROVISIONNEMENT_STATUTS,
  getApprovisionnementStatutLabel,
} from "@/constants/ApprovisionnementStatut";
import ApprovisionnementStatutBadge from "@/components/status/ApprovisionnementStatutBadge";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const ApprovisionnementsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: approvisionnements, isLoading, isError } = useGetApprovisionnementsService();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [urgenceFilter, setUrgenceFilter] = useState<"toutes" | "urgence" | "non_urgence">("toutes");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const openApprovisionnement = (approvisionnement: ApprovisionnementInterface) => {
    navigate(`/chef_service/approvisionnement/view/${approvisionnement._id}`);
  };

  const filterApprovisionnements = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (approvisionnement: ApprovisionnementInterface) =>
    !searchTerm.trim() ||
    [
      approvisionnement.numeroApprovisionnement,
      approvisionnement.bonMagasin?.numeroBonMagasin,
      approvisionnement.bonMagasin?.objet,
      approvisionnement.bonMagasin?.demande?.numeroDemande,
      approvisionnement.bonMagasin?.demande?.motif,
      approvisionnement.bonMagasin?.demande?.demandeur?.nom,
      approvisionnement.bonMagasin?.demande?.demandeur?.prenom,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredApprovisionnements = (
    filterRef
      ? (approvisionnements ?? []).filter(
          (approvisionnement: ApprovisionnementInterface) =>
            approvisionnement.statutApprovisionnement === filterText,
        )
      : approvisionnements ?? []
  )
    .filter(
      (approvisionnement: ApprovisionnementInterface) =>
        urgenceFilter === "toutes" ||
        (urgenceFilter === "urgence" &&
          !!approvisionnement.bonMagasin?.demande?.urgence) ||
        (urgenceFilter === "non_urgence" &&
          !approvisionnement.bonMagasin?.demande?.urgence),
    )
    .filter(matchesSearch);

  const sortedApprovisionnements = sortDateDir
    ? [...filteredApprovisionnements].sort(
        (a: ApprovisionnementInterface, b: ApprovisionnementInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateApprovisionnement).getTime() -
              new Date(b.dateApprovisionnement).getTime()
            : new Date(b.dateApprovisionnement).getTime() -
              new Date(a.dateApprovisionnement).getTime(),
      )
    : filteredApprovisionnements;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedApprovisionnements.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedApprovisionnements = sortedApprovisionnements.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedApprovisionnements.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedApprovisionnements.length);

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
            placeholder="Recherche par approvisionnement, bon, objet ou demandeur"
            className="w-80 border-[#d9dee5] pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select
            value={urgenceFilter}
            onValueChange={(value) => {
              setUrgenceFilter(value as "toutes" | "urgence" | "non_urgence");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-44 shrink-0 border-[#d9dee5]">
              <Zap className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par urgence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les urgences</SelectItem>
              <SelectItem value="urgence">Urgentes</SelectItem>
              <SelectItem value="non_urgence">Non urgentes</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterApprovisionnements(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className="w-56 shrink-0 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {APPROVISIONNEMENT_STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {getApprovisionnementStatutLabel(statut)}
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
                <th className="w-10 px-4 py-3 text-left align-middle"></th>
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
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° approvisionnement</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Bon de magasin</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Demandeur</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Statut</th>
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
                    Une erreur est survenue lors du chargement des approvisionnements.
                  </td>
                </tr>
              ) : sortedApprovisionnements.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucun approvisionnement trouvé
                  </td>
                </tr>
              ) : (
                paginatedApprovisionnements.map(
                  (approvisionnement: ApprovisionnementInterface) => {
                    const demandeur = approvisionnement.bonMagasin?.demande?.demandeur;
                    return (
                      <tr
                        key={approvisionnement._id}
                        onClick={() => openApprovisionnement(approvisionnement)}
                        className={`border-b border-[#f1f5f9] border-l-2 transition-colors last:border-b-0 cursor-pointer ${
                          approvisionnement.bonMagasin?.demande?.urgence
                            ? "border-l-red-400 bg-red-50/60 hover:bg-red-100/50 hover:border-l-red-400"
                            : "border-l-transparent hover:bg-[#e9f5ee]/40 hover:border-l-brand"
                        }`}
                      >
                        <td className="px-4 py-3">
                          {approvisionnement.bonMagasin?.demande?.urgence ? (
                            <Zap className="size-5 text-red-500" />
                          ) : null}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {formatDate(approvisionnement.dateApprovisionnement)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700">
                            {approvisionnement.numeroApprovisionnement}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[260px]">
                          {approvisionnement.bonMagasin ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-foreground truncate">
                                {approvisionnement.bonMagasin.objet}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {approvisionnement.bonMagasin.numeroBonMagasin}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {demandeur ? (
                            <div className="flex items-center gap-2.5">
                              <span className="w-8 h-8 shrink-0 rounded-full bg-brand text-white grid place-items-center text-xs font-bold">
                                {demandeur.nom?.[0] ?? ''}
                                {demandeur.prenom?.[0] ?? ''}
                              </span>
                              <span className="font-medium text-foreground">
                                {demandeur.nom} {demandeur.prenom}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ApprovisionnementStatutBadge
                            statut={approvisionnement.statutApprovisionnement}
                          />
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>

        {sortedApprovisionnements.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedApprovisionnements.length}{" "}
              {pluriel(sortedApprovisionnements.length, "approvisionnement", "approvisionnements")}
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

export default ApprovisionnementsPage;
