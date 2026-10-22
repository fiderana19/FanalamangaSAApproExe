import React, { useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  FileDown,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetBonSorties } from "@/hooks/useGetBonSorties";
import { BonSortieInterface } from "@/interfaces/BonSortie";
import {
  BON_SORTIE_STATUTS,
  getApurementLabel,
  getBonSortieStatutLabel,
} from "@/constants/BonSortieStatut";
import BonSortieStatutBadge from "@/components/status/BonSortieStatutBadge";
import { getBonSortie } from "@/api/bonSorties";
import { downloadBlob, generateBonSortieBlob } from "@/utils/BonMagasinPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;

const BonsSortiePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: sorties, isLoading, isError } = useGetBonSorties();
  const [menuSortieId, setMenuSortieId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [generatingSortieId, setGeneratingSortieId] = useState<string | null>(
    null,
  );

  const handleGeneratePdf = async (sortie: BonSortieInterface) => {
    setGeneratingSortieId(sortie._id);
    try {
      const response = await getBonSortie(sortie._id);
      const fullSortie = response.data as BonSortieInterface;
      const blob = await generateBonSortieBlob(fullSortie);
      downloadBlob(blob, `${sanitizeFileName(fullSortie.numeroSortie)}.pdf`);
    } catch {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    } finally {
      setGeneratingSortieId(null);
    }
  };

  const filterSorties = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (sortie: BonSortieInterface) =>
    !searchTerm.trim() ||
    [
      sortie.numeroSortie,
      sortie.approvisionnement?.numeroApprovisionnement,
      sortie.approvisionnement?.bonMagasin?.numeroBonMagasin,
      sortie.approvisionnement?.bonMagasin?.objet,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredSorties = (
    filterRef
      ? (sorties ?? []).filter(
          (sortie: BonSortieInterface) =>
            sortie.statutSortie === filterText,
        )
      : sorties ?? []
  ).filter(matchesSearch);

  const sortedSorties = sortDateDir
    ? [...filteredSorties].sort(
        (a: BonSortieInterface, b: BonSortieInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateSortie).getTime() -
              new Date(b.dateSortie).getTime()
            : new Date(b.dateSortie).getTime() -
              new Date(a.dateSortie).getTime(),
      )
    : filteredSorties;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedSorties.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSorties = sortedSorties.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedSorties.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedSorties.length);

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
            placeholder="Recherche par n° sortie, appro ou bon"
            className="w-72 border-[#d9dee5] pl-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select
            value={filterRef ? filterText : "all"}
            onValueChange={(value) =>
              value !== "all" ? filterSorties(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className="w-48 shrink-0 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {BON_SORTIE_STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {getBonSortieStatutLabel(statut)}
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
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° sortie</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Objet</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Apurement</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Actions</th>
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
                    Une erreur est survenue lors du chargement des bons de sortie de magasin.
                  </td>
                </tr>
              ) : sortedSorties.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucun bon de sortie de magasin trouvé
                  </td>
                </tr>
              ) : (
                paginatedSorties.map((sortie: BonSortieInterface) => (
                  <tr
                    key={sortie._id}
                    className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0 cursor-pointer"
                    onClick={() => navigate(`/agent_appro/bon-sortie/view/${sortie._id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(sortie.dateSortie)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-xs font-semibold text-teal-700">
                        {sortie.numeroSortie}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <span className="block font-medium text-foreground truncate">
                        {sortie.approvisionnement?.bonMagasin?.objet ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          (sortie.apurement === "total"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600")
                        }`}
                      >
                        {getApurementLabel(sortie.apurement)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BonSortieStatutBadge statut={sortie.statutSortie} />
                    </td>
                    <td
                      className="pr-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end">
                        <Popover
                          open={menuSortieId === sortie._id}
                          onOpenChange={(open) =>
                            setMenuSortieId(open ? sortie._id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Actions"
                              className="text-gray-500 hover:text-brand hover:bg-[#e9f5ee]"
                            >
                              <EllipsisVertical />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-52 p-1">
                            <button
                              type="button"
                              disabled={generatingSortieId === sortie._id}
                              onClick={() => handleGeneratePdf(sortie)}
                              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-600 outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                            >
                              {generatingSortieId === sortie._id ? (
                                <LoadingOutlined />
                              ) : (
                                <FileDown />
                              )}{" "}
                              Générer
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sortedSorties.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedSorties.length}{" "}
              {pluriel(sortedSorties.length, "bon de sortie", "bons de sortie")}
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

export default BonsSortiePage;