import * as XLSX from "xlsx";
import { downloadBlob } from "@/utils/BonMagasinPdf";

export const exportExcel = (
  baseName: string,
  header: string[],
  rows: (string | number)[][],
  sheetName = "Historique",
) => {
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${baseName}.xlsx`);
};

export const exportCsv = (
  baseName: string,
  header: string[],
  rows: (string | number)[][],
) => {
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${baseName}.csv`);
};