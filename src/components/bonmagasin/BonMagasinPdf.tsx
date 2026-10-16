import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png?inline";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { BonMagasinInterface, LigneBonMagasinInterface } from "@/interfaces/BonMagasin";
import { RessourceRef } from "@/interfaces/Demande";

const INK = "#111820";
const BORDER = "#1b252c";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 18,
    fontSize: 13,
    fontFamily: "Helvetica",
    color: INK,
  },
  topline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    fontSize: 13,
  },
  dept: {
    fontSize: 13,
  },
  date: {
    paddingTop: 10,
    fontSize: 13,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  logoImg: {
    width: 48,
    height: 48,
    borderRadius: 999,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: INK,
  },
  meta: {
    marginBottom: 14,
    paddingHorizontal: 6,
    fontSize: 12,
    lineHeight: 1.5,
  },
  metaLabel: {
    fontWeight: "bold",
    color: INK,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    textAlign: "center",
    fontSize: 9.5,
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  cellLast: {
    borderRightWidth: 0,
  },
  header: {
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 10,
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  bodyRowLast: {
    borderBottomWidth: 0,
  },
  bodyCell: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  designationCell: {
    textAlign: "left",
  },
  observationCell: {
    textAlign: "left",
    lineHeight: 1.25,
  },
  signatures: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 10,
  },
  sigHeader: {
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: 10,
  },
  sigBody: {
    height: 58,
  },
});

const getRessource = (
  ressource: RessourceRef | string | null | undefined,
): RessourceRef | null =>
  ressource && typeof ressource === "object" ? ressource : null;

const formatDateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const COLUMNS = [
  { widthPct: 6 },
  { widthPct: 10 },
  { widthPct: 30 },
  { widthPct: 12 },
  { widthPct: 14 },
  { widthPct: 28 },
];

interface BonMagasinPdfProps {
  bon: BonMagasinInterface;
}

const BonMagasinPdf: React.FC<BonMagasinPdfProps> = ({ bon }) => {
  const service = bon.demande?.demandeur?.service;
  const serviceDemandeur = service?.nomService || service?.sigleService || "—";
  const affectation = service?.lieuService || "—";
  const lignes = bon.lignes ?? [];

  const renderItemsRow = (ligne: LigneBonMagasinInterface, index: number) => {
    const ressource = getRessource(ligne.ligneDemande?.ressource);
    const isLast = index === lignes.length - 1;
    const values = [
      String(index + 1),
      ressource?.reference ?? "",
      ressource?.designationRessource ?? "",
      ressource?.unite ? getUniteLabel(ressource.unite) : "",
      String(ligne.quantiteLigneBonMagasin),
      ligne.observation?.trim() ? ligne.observation : "",
    ];

    return (
      <View
        key={ligne._id}
        style={[
          styles.row,
          styles.bodyRow,
          ...(isLast ? [styles.bodyRowLast] : []),
        ]}
      >
        {values.map((value, colIndex) => {
          const isLastCol = colIndex === values.length - 1;
          const align =
            colIndex === 2 || colIndex === 5 ? styles.designationCell : null;
          return (
            <View
              key={colIndex}
              style={[
                styles.cell,
                styles.bodyCell,
                ...(align ? [align] : []),
                ...(isLastCol ? [styles.cellLast] : []),
                { width: `${COLUMNS[colIndex].widthPct}%` },
              ]}
            >
              <Text>{value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSigRow = () => {
    const headers = ["Demandeur", "Chef hiérarchique", "Directeur rattaché", "Magasinier"];
    const widths = [22, 34, 24, 20];
    return (
      <View>
        <View style={[styles.row, styles.headerRow]}>
          {headers.map((label, index) => (
            <View
              key={label}
              style={[
                styles.cell,
                styles.header,
                styles.sigHeader,
                ...(index === headers.length - 1 ? [styles.cellLast] : []),
                { width: `${widths[index]}%` },
              ]}
            >
              <Text>{label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.row}>
          {headers.map((label, index) => (
            <View
              key={label}
              style={[
                styles.cell,
                styles.sigBody,
                ...(index === headers.length - 1 ? [styles.cellLast] : []),
                { width: `${widths[index]}%` },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topline}>
          <Text style={styles.dept}>DEP N° </Text>
          <Text style={styles.date}>Date : {formatDateLong(bon.dateBonMagasin)}</Text>
        </View>

        <View style={styles.titleRow}>
          <Image src={FanalamangaLogo} style={styles.logoImg} />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              BON MAGASIN N°{bon.numeroBonMagasin}
            </Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Text>
            <Text style={styles.metaLabel}>Service demandeur :</Text>{" "}
            {serviceDemandeur}
          </Text>
          <Text>
            <Text style={styles.metaLabel}>Objet :</Text> {bon.objet}
          </Text>
          <Text>
            <Text style={styles.metaLabel}>Affectation :</Text> {affectation}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            {["ITEM", "REF", "DÉSIGNATION", "UNITÉ", "QUANTITÉ", "OBSERVATION"].map(
              (label, index) => (
                <View
                  key={label}
                  style={[
                    styles.cell,
                    styles.header,
                    ...(COLUMNS.length - 1 === index ? [styles.cellLast] : []),
                    { width: `${COLUMNS[index].widthPct}%` },
                  ]}
                >
                  <Text>{label}</Text>
                </View>
              ),
            )}
          </View>
          {lignes.length === 0 ? (
            <View style={[styles.row, styles.bodyRow, styles.bodyRowLast]}>
              <Text style={[styles.cell, { width: "100%" }]}>
                Aucune ressource
              </Text>
            </View>
          ) : (
            lignes.map(renderItemsRow)
          )}
        </View>

        <View style={styles.signatures}>
          {renderSigRow()}
        </View>
      </Page>
    </Document>
  );
};

export default BonMagasinPdf;