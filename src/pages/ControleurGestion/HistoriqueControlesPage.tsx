import React, { useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  PackageX,
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
import { useGetHistoriqueControles } from "@/hooks/useGetHistoriqueControles";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";
import { ControleInterface, ControleStatutType } from "@/interfaces/Demande";

const CONTROLE_LABELS: Record<ControleStatutType, string> = {
  conforme: "Conforme",
  non_conforme: "Non conforme",
};

const CONTROLE_META: Record<
  ControleStatutType,
  { badge: string; icon: React.ElementType }
> = {
  conforme: { badge: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  non_conforme: { badge: "bg-rose-50 text-rose-600", icon: PackageX },
};

const PAGE_SIZE = 10;

const HistoriqueControlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statutFilter, setStatutFilter] = useState<
    "tous" | ControleStatutType
  >("tous");
  const [sortDateDir, setSortDateDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: controles, isLoading, isError } = useGetHistoriqueControles();

  const matchesSearch = (controle: ControleInterface) =>
    !searchTerm.trim() ||
    [
      controle.demande?.numeroDemande,
      controle.demande?.motif,
      controle.demande?.demandeur?.nom,
      controle.demande?.demandeur?.prenom,
      controle.utilisateur?.nom,
      controle.utilisateur?.prenom,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

  const filteredControles = (controles ?? []).filter(
    (controle: ControleInterface) =>
      (statutFilter === "tous" || controle.statutControle === statutFilter) &&
      matchesSearch(controle),
  );

  const sortedControles = sortDateDir
    ? [...filteredControles].sort(
        (a: ControleInterface, b: ControleInterface) =>
          sortDateDir === "asc"
            ? new Date(a.dateControle).getTime() -
              new Date(b.dateControle).getTime()
            : new Date(b.dateControle).getTime() -
              new Date(a.dateControle).getTime(),
      )
    : filteredControles;

  const toggleSortDate = () => {
    setSortDateDir((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedControles.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedControles = sortedControles.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startCount =
    sortedControles.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endCount = Math.min(safePage * PAGE_SIZE, sortedControles.length);

  const openView = (controle: ControleInterface) => {
    navigate(`/controleur_gestion/controle/view/${controle._id}`);
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
          value={statutFilter}
          onValueChange={(value) => {
            setStatutFilter(value as "tous" | ControleStatutType);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-44 border-[#d9dee5]">
            <Filter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="conforme">Conforme</SelectItem>
            <SelectItem value="non_conforme">Non conforme</SelectItem>
          </SelectContent>
        </Select>
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
                    Date du contrôle
                    {sortDateDir === "asc" ? (
                      <ChevronUp className="size-3.5 text-brand" />
                    ) : (
                      <ChevronDown className="size-3.5 text-brand" />
                    )}
                  </span>
                </th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">N° demande</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Demandeur</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Contrôle</th>
                <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Contrôleur</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={5}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap"
                  >
                    <LoadingOutlined className="text-2xl text-brand" />
                  </td>
                </tr>
              ) : isError ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={5}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-red-500"
                  >
                    Une erreur est survenue lors du chargement des contrôles.
                  </td>
                </tr>
              ) : sortedControles.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={5}
                    className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted"
                  >
                    Aucun contrôle enregistré
                  </td>
                </tr>
              ) : (
                paginatedControles.map((controle: ControleInterface) => {
                  const meta = CONTROLE_META[controle.statutControle];
                  const CongIcon = meta.icon;
                  return (
                    <tr
                      key={controle._id}
                      onClick={() => openView(controle)}
                      className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors cursor-pointer hover:bg-[#e9f5ee]/40 hover:border-l-brand last:border-b-0"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(controle.dateControle)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                          {controle.demande?.numeroDemande ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {controle.demande?.demandeur ? (
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 shrink-0 rounded-full bg-brand text-white grid place-items-center text-xs font-bold">
                              {controle.demande.demandeur.nom?.[0] ?? ''}
                              {controle.demande.demandeur.prenom?.[0] ?? ''}
                            </span>
                            <span className="font-medium text-foreground">
                              {controle.demande.demandeur.nom}{" "}
                              {controle.demande.demandeur.prenom}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badge}`}
                        >
                          <CongIcon className="size-3.5" />
                          {CONTROLE_LABELS[controle.statutControle]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {controle.utilisateur
                          ? `${controle.utilisateur.nom ?? ""} ${controle.utilisateur.prenom ?? ""}`.trim() || "—"
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {sortedControles.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#f1f5f9] bg-gray-50/60 px-4 py-2.5">
            <div className="text-sm text-brand-muted whitespace-nowrap">
              {startCount}–{endCount} sur {sortedControles.length}{" "}
              {pluriel(sortedControles.length, "contrôle", "contrôles")}
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

export default HistoriqueControlesPage;