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
  EllipsisVertical,
  FileDown,
  Filter,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBonsMagasin } from "@/hooks/useGetBonsMagasin";
import { BonMagasinInterface } from "@/interfaces/BonMagasin";
import {
  BON_MAGASIN_STATUTS,
  getBonMagasinStatutLabel,
} from "@/constants/BonMagasinStatut";
import BonMagasinStatutBadge from "@/components/status/BonMagasinStatutBadge";
import { getBonMagasin } from "@/api/bonmagasins";
import { downloadBlob, generateBonMagasinBlob } from "@/utils/BonMagasinPdf";
import { sanitizeFileName } from "@/utils/FileName";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const PAGE_SIZE = 10;
const BASE_ROUTE = "/agent_appro/bon-magasin";

const BonsMagasinPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: bons, isLoading, isError } = useGetBonsMagasin();
  const [menuBonId, setMenuBonId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [urgenceFilter, setUrgenceFilter] = useState<"toutes" | "urgence" | "non_urgence">("toutes");
  const [filterRef, setFilterRef] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [generatingBonId, setGeneratingBonId] = useState<string | null>(null);

  const handleGeneratePdf = async (bon: BonMagasinInterface) => {
    setGeneratingBonId(bon._id);
    try {
      const response = await getBonMagasin(bon._id);
      const fullBon = response.data as BonMagasinInterface;
      const blob = await generateBonMagasinBlob(fullBon);
      downloadBlob(blob, `${sanitizeFileName(fullBon.numeroBonMagasin)}.pdf`);
    } catch {
      showToast({
        type: TOAST_TYPE.ERROR,
        message: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    } finally {
      setGeneratingBonId(null);
    }
  };

  const filterBons = (filter: string) => {
    setFilterRef(true);
    setFilterText(filter);
    setCurrentPage(1);
  };

  const matchesSearch = (bon: BonMagasinInterface) =>
    !searchTerm.trim() ||
    [
      bon.numeroBonMagasin,
      bon.objet,
      bon.demande?.numeroDemande,
      bon.demande?.motif,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredBons = (
    filterRef
      ? (bons ?? []).filter(
          (bon: BonMagasinInterface) =>
            bon.statutBonMagasin === filterText,
        )
      : bons ?? []
  )
    .filter(
      (bon: BonMagasinInterface) =>
        urgenceFilter === "toutes" ||
        (urgenceFilter === "urgence" && !!bon.demande?.urgence) ||
        (urgenceFilter === "non_urgence" && !bon.demande?.urgence),
    )
    .filter(matchesSearch);

  const sortedBons = sortDateDir
    ? [...filteredBons].sort(
        (a: BonMagasinInterface, b: BonMagasinInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateBonMagasin).getTime() -
              new Date(b.dateBonMagasin).getTime()
            : new Date(b.dateBonMagasin).getTime() -
              new Date(a.dateBonMagasin).getTime(),
      )
    : filteredBons;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedBons.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBons = sortedBons.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedBons.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedBons.length);

  const openView = (bon: BonMagasinInterface) => {
    navigate(`${BASE_ROUTE}/view/${bon._id}`);
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

  const colCount = 7;

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative shrink-0">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Recherche par bon, objet ou demande"
            className="w-72 border-[#d9dee5] pl-9"
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
              value !== "all" ? filterBons(value) : setFilterRef(false)
            }
          >
            <SelectTrigger className="w-48 shrink-0 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {BON_MAGASIN_STATUTS.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {getBonMagasinStatutLabel(statut)}
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
                    Date du bon
                    {sortDateDir === "asc" ? (
                      <ChevronUp className="size-3.5 text-brand" />
                    ) : (
                      <ChevronDown className="size-3.5 text-brand" />
                    )}
                  </span>
                </th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° bon</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Demandeur</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Objet</th>
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
                    Une erreur est survenue lors du chargement des bons de magasin.
                  </td>
                </tr>
              ) : sortedBons.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={colCount}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucun bon de magasin trouvé
                  </td>
                </tr>
              ) : (
                paginatedBons.map((bon: BonMagasinInterface) => (
                  <tr
                    key={bon._id}
                    onClick={() => openView(bon)}
                    className={`border-b border-[#f1f5f9] border-l-2 transition-colors cursor-pointer last:border-b-0 ${
                      bon.demande?.urgence
                        ? "border-l-red-400 bg-red-50/60 hover:bg-red-100/50 hover:border-l-red-400"
                        : "border-l-transparent hover:bg-[#e9f5ee]/40 hover:border-l-brand"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {bon.demande?.urgence ? (
                        <Zap className="size-5 text-red-500" />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(bon.dateBonMagasin)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                        {bon.numeroBonMagasin}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {bon.demande?.demandeur ? (
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 shrink-0 rounded-full bg-brand text-white grid place-items-center text-xs font-bold">
                            {bon.demande.demandeur.nom?.[0] ?? ''}
                            {bon.demande.demandeur.prenom?.[0] ?? ''}
                          </span>
                          <span className="font-medium text-foreground">
                            {bon.demande.demandeur.nom} {bon.demande.demandeur.prenom}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <span className="block font-medium text-foreground truncate">
                        {bon.objet}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BonMagasinStatutBadge statut={bon.statutBonMagasin} />
                    </td>
                    <td
                      className="pr-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end">
                        <Popover
                          open={menuBonId === bon._id}
                          onOpenChange={(open) =>
                            setMenuBonId(open ? bon._id : null)
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
                              disabled={generatingBonId === bon._id}
                              onClick={() => handleGeneratePdf(bon)}
                              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-600 outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                            >
                              {generatingBonId === bon._id ? (
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

        {sortedBons.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedBons.length}{" "}
              {pluriel(sortedBons.length, "bon", "bons")}
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

export default BonsMagasinPage;