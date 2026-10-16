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
import { useGetDemandesAControler } from "@/hooks/useGetDemandesAControler";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";
import { DemandeInterface } from "@/interfaces/Demande";
import DemandeStatutBadge from "@/components/status/DemandeStatutBadge";

const PAGE_SIZE = 10;

const DemandesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [urgenceFilter, setUrgenceFilter] = useState<"toutes" | "urgence" | "non_urgence">("toutes");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: demandes, isLoading, isError } = useGetDemandesAControler();

  const matchesSearch = (demande: DemandeInterface) =>
    !searchTerm.trim() ||
    [
      demande.numeroDemande,
      demande.motif,
      demande.demandeur?.nom,
      demande.demandeur?.prenom,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredDemandes = (demandes ?? []).filter(
    (demande: DemandeInterface) =>
      (urgenceFilter === "toutes" ||
        (urgenceFilter === "urgence" && demande.urgence) ||
        (urgenceFilter === "non_urgence" && !demande.urgence)) &&
      matchesSearch(demande),
  );

  const sortedDemandes = sortDateDir
    ? [...filteredDemandes].sort(
        (a: DemandeInterface, b: DemandeInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateDemande).getTime() -
              new Date(b.dateDemande).getTime()
            : new Date(b.dateDemande).getTime() -
              new Date(a.dateDemande).getTime(),
      )
    : filteredDemandes;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedDemandes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDemandes = sortedDemandes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedDemandes.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedDemandes.length);

  const openView = (demande: DemandeInterface) => {
    navigate(`/controleur_gestion/demande/view/${demande._id}`);
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

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="relative shrink-0">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Recherche par numéro, motif ou demandeur"
            className="w-72 border-[#d9dee5] pl-9"
          />
        </div>
        <Select
          value={urgenceFilter}
          onValueChange={(value) => {
            setUrgenceFilter(value as "toutes" | "urgence" | "non_urgence");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-48 border-[#d9dee5]">
            <Filter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Filtrer par urgence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les demandes</SelectItem>
            <SelectItem value="urgence">Demandes urgentes</SelectItem>
            <SelectItem value="non_urgence">Demandes non urgentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="panel flex flex-col overflow-hidden rounded-lg">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 sticky top-0 z-10">
              <tr className="border-b border-brand-border">
                <th className="w-10 px-4 py-3"></th>
                <th
                  className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground cursor-pointer select-none"
                  onClick={toggleSortDate}
                >
                  <span className="inline-flex items-center gap-1">
                    Date de la demande
                    {sortDateDir === "asc" ? (
                      <ChevronUp className="size-3.5 text-brand" />
                    ) : (
                      <ChevronDown className="size-3.5 text-brand" />
                    )}
                  </span>
                </th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° demande</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Demandeur</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Motif</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={6}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap"
                  >
                    <LoadingOutlined className="text-2xl text-brand" />
                  </td>
                </tr>
              ) : isError ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={6}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-red-500"
                  >
                    Une erreur est survenue lors du chargement des demandes.
                  </td>
                </tr>
              ) : sortedDemandes.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={6}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucune demande à contrôler
                  </td>
                </tr>
              ) : (
                paginatedDemandes.map((demande: DemandeInterface) => (
                  <tr
                    key={demande._id}
                    onClick={() => openView(demande)}
                    className={`border-b border-[#f1f5f9] border-l-2 transition-colors cursor-pointer last:border-b-0 ${
                      demande.urgence
                        ? "border-l-red-400 bg-red-50/60 hover:bg-red-100/50 hover:border-l-red-400"
                        : "border-l-transparent hover:bg-[#e9f5ee]/40 hover:border-l-brand"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {demande.urgence ? (
                        <Zap className="size-5 text-red-500" />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(demande.dateDemande)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                        {demande.numeroDemande}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {demande.demandeur ? (
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 shrink-0 rounded-full bg-brand text-white grid place-items-center text-xs font-bold">
                            {demande.demandeur.nom?.[0] ?? ''}
                            {demande.demandeur.prenom?.[0] ?? ''}
                          </span>
                          <span className="font-medium text-foreground">
                            {demande.demandeur.nom} {demande.demandeur.prenom}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <span className="block font-medium text-foreground truncate">
                        {demande.motif}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <DemandeStatutBadge
                        statut={demande.statutActuelDemande}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sortedDemandes.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedDemandes.length}{" "}
              {pluriel(sortedDemandes.length, "demande", "demandes")}
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

export default DemandesPage;