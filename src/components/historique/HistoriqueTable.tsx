import React, { useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { FileSpreadsheet, FileText, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { exportCsv, exportExcel } from "@/utils/ExcelExport";

export interface HistoriqueColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

export interface HistoriqueStatutOption {
  value: string;
  label: string;
}

interface HistoriqueTableProps<T> {
  columns: HistoriqueColumn<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  searchPlaceholder?: string;
  exportBaseName?: string;
  getDate: (item: T) => string;
  getStatut?: (item: T) => string;
  statutOptions?: HistoriqueStatutOption[];
}

const toText = (node: React.ReactNode): string => {
  if (node === null || node === undefined) {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(toText).join(" ");
  }
  if (React.isValidElement(node)) {
    const { children } = (node as React.ReactElement<{ children?: React.ReactNode }>).props ?? {};
    return toText(children);
  }
  return "";
};

const toDateInputValue = (date: string): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
};

function HistoriqueTable<T>({
  columns,
  data,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  searchPlaceholder = "Rechercher",
  exportBaseName,
  getDate,
  getStatut,
  statutOptions,
}: HistoriqueTableProps<T>) {
  const [keyword, setKeyword] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statutFilter, setStatutFilter] = useState<string>("tous");
  const [pendingExport, setPendingExport] = useState<"csv" | "excel" | null>(
    null,
  );

  const rows = data ?? [];

  const keywordLower = keyword.trim().toLowerCase();

  const matchesKeyword = (item: T) =>
    !keywordLower ||
    columns
      .map((column) => toText(column.render(item)))
      .join(" ")
      .toLowerCase()
      .includes(keywordLower);

  const matchesDate = (item: T) =>
    !dateFilter || toDateInputValue(getDate(item)) === dateFilter;

  const matchesStatut = (item: T) =>
    statutFilter === "tous" || !getStatut || getStatut(item) === statutFilter;

  const filtered = rows.filter(
    (item) => matchesKeyword(item) && matchesDate(item) && matchesStatut(item),
  );

  const hasFilters =
    keyword.length > 0 || dateFilter.length > 0 || statutFilter !== "tous";

  const resetFilters = () => {
    setKeyword("");
    setDateFilter("");
    setStatutFilter("tous");
  };

  const exportHeader = columns.map((column) => column.label);
  const exportRows = rows.map((item) =>
    columns.map((column) => toText(column.render(item))),
  );

  const handleExportExcel = () => {
    if (exportBaseName && exportRows.length > 0) {
      exportExcel(exportBaseName, exportHeader, exportRows);
    }
    setPendingExport(null);
  };

  const handleExportCsv = () => {
    if (exportBaseName && exportRows.length > 0) {
      exportCsv(exportBaseName, exportHeader, exportRows);
    }
    setPendingExport(null);
  };

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-64 border-[#d9dee5] pl-9"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-[#d9dee5] rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white"
        />
        {statutOptions && statutOptions.length > 0 && (
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-44 border-[#d9dee5]">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              {statutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="gap-1"
          >
            <RotateCcw className="size-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="panel flex flex-col overflow-hidden rounded-lg mb-12">
        <div className="overflow-auto max-h-[64vh]">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-3 py-2 text-left align-middle font-semibold whitespace-nowrap text-xs uppercase tracking-wide text-gray-600 border border-gray-300"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-2 py-10 text-center align-middle"
                  >
                    <LoadingOutlined className="text-2xl text-brand" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-2 py-10 text-center align-middle text-red-500"
                  >
                    {errorLabel}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-2 py-10 text-center align-middle text-gray-400"
                  >
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-3 py-1.5 align-middle whitespace-nowrap border border-gray-300 text-gray-700 ${column.className ?? ""}`}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {exportBaseName && exportRows.length > 0 && (
        <div className="absolute bottom-0 right-0 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPendingExport("csv")}
            className="gap-1.5"
          >
            <FileText className="size-4" />
            Exporter CSV
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPendingExport("excel")}
            className="gap-1.5"
          >
            <FileSpreadsheet className="size-4" />
            Exporter Excel
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={pendingExport !== null}
        title='Confirmer l’exportation'
        description={`Un fichier ${pendingExport === "csv" ? "CSV (.csv)" : "Excel (.xlsx)"} contenant toutes les données de l’historique sera téléchargé.`}
        icon={
          pendingExport === "csv" ? (
            <FileText className='text-lg' />
          ) : (
            <FileSpreadsheet className='text-lg' />
          )
        }
        tone='brand'
        confirmVariant='secondary'
        confirmLabel='Exporter'
        cancelLabel='Annuler'
        onConfirm={pendingExport === "csv" ? handleExportCsv : handleExportExcel}
        onCancel={() => setPendingExport(null)}
      />
    </div>
  );
}

export default HistoriqueTable;