import React, { useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  QrCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetMesLivraisons } from "@/hooks/useGetMesLivraisons";
import { LivraisonInterface } from "@/interfaces/Livraison";
import {
  LIVRAISON_STATUTS,
  getLivraisonStatutLabel,
} from "@/constants/LivraisonStatut";
import LivraisonStatutBadge from "@/components/status/LivraisonStatutBadge";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const LivraisonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: livraisons, isLoading, isError } = useGetMesLivraisons();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterLivraisons = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (livraison: LivraisonInterface) =>
    !searchTerm.trim() ||
    [
      livraison.numeroLivraison,
      livraison.sortie?.numeroSortie,
      livraison.sortie?.approvisionnement?.numeroApprovisionnement,
      livraison.sortie?.approvisionnement?.bonMagasin?.numeroBonMagasin,
      livraison.sortie?.approvisionnement?.bonMagasin?.objet,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredLivraisons = (
    filterRef
      ? (livraisons ?? []).filter(
          (livraison: LivraisonInterface) =>
            livraison.statutLivraison === filterText,
        )
      : livraisons ?? []
  ).filter(matchesSearch);

  const sortedLivraisons = sortDateDir
    ? [...filteredLivraisons].sort(
        (a: LivraisonInterface, b: LivraisonInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateCreationLivraison).getTime() -
              new Date(b.dateCreationLivraison).getTime()
            : new Date(b.dateCreationLivraison).getTime() -
              new Date(a.dateCreationLivraison).getTime(),
      )
    : filteredLivraisons;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedLivraisons.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLivraisons = sortedLivraisons.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedLivraisons.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedLivraisons.length);

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

  const colCount = 5;

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative shrink-0">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Recherche par n° livraison, sortie ou bon"
            className="w-72 border-[#d9dee5] pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterLivraisons(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className="w-52 shrink-0 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {LIVRAISON_STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {getLivraisonStatutLabel(statut)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="brand"
            className="shrink-0"
            onClick={() => navigate("/employe/livraison/scan")}
          >
            <QrCode className="size-4" />
            Recevoir une livraison
          </Button>
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
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° livraison</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Bon de sortie</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Objet</th>
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
                    Une erreur est survenue lors du chargement des livraisons.
                  </td>
                </tr>
              ) : sortedLivraisons.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucune livraison trouvée
                  </td>
                </tr>
              ) : (
                paginatedLivraisons.map((livraison: LivraisonInterface) => (
                  <tr
                    key={livraison._id}
                    className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0 cursor-pointer"
                    onClick={() => navigate(`/employe/livraison/view/${livraison._id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(livraison.dateCreationLivraison)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                        {livraison.numeroLivraison}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {livraison.sortie ? (
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                          {livraison.sortie.numeroSortie}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <span className="block font-medium text-foreground truncate">
                        {livraison.sortie?.approvisionnement?.bonMagasin?.objet ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <LivraisonStatutBadge statut={livraison.statutLivraison} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sortedLivraisons.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedLivraisons.length}{" "}
              {pluriel(sortedLivraisons.length, "livraison", "livraisons")}
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

export default LivraisonsPage;
