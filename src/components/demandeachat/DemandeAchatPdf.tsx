import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import FanalamangaLogo from "@/assets/image/fanalamanga-logo.png?inline";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { DemandeAchatInterface } from "@/interfaces/DemandeAchat";

const INK = "#111820";
const BORDER = "#1b252c";
const ACCENT = "#c2410c";
const ACCENT_SOFT = "#fff7ed";
const TEAL_SOFT = "#e9f5ee";

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
  pillWrapper: {
    alignItems: "center",
    marginBottom: 14,
  },
  pill: {
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: ACCENT_SOFT,
    color: ACCENT,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 12,
    fontSize: 10,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "column",
    marginBottom: 14,
    paddingHorizontal: 6,
    fontSize: 12,
    lineHeight: 1.5,
  },
  box: {
    width: "100%",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  boxLast: {
    marginRight: 0,
    marginBottom: 0,
  },
  boxHeader: {
    backgroundColor: TEAL_SOFT,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 10,
    fontWeight: "bold",
  },
  boxBody: {
    padding: 7,
  },
  infoLine: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 10,
  },
  tableTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyCell: {
    textAlign: "center",
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

const COLUMNS = [
  { widthPct: 6 },
  { widthPct: 12 },
  { widthPct: 34 },
  { widthPct: 13 },
  { widthPct: 35 },
];

const TABLE_HEADERS = ["N°", "Référence", "Désignation", "Unité", "Quantité"];

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

interface InfoLineProps {
  label: string;
  value?: string | null;
}

const InfoLine: React.FC<InfoLineProps> = ({ label, value }) => (
  <Text style={styles.infoLine}>
    <Text style={styles.infoLabel}>{label} :</Text> {value?.trim() ? value : "—"}
  </Text>
);

interface DemandeAchatPdfProps {
  demandeAchat: DemandeAchatInterface;
}

const DemandeAchatPdf: React.FC<DemandeAchatPdfProps> = ({ demandeAchat }) => {
  const appro = demandeAchat.approvisionnement ?? null;
  const bon = appro?.bonMagasin ?? null;
  const lignes = demandeAchat.lignes ?? [];

  const renderItemsRow = (ligne: (typeof lignes)[number], index: number) => {
    const ressource = ligne.ressource ?? null;
    const isLast = index === lignes.length - 1;
    const values = [
      String(index + 1),
      ressource?.reference ?? "",
      ressource?.designationRessource ?? "",
      ressource?.unite ? getUniteLabel(ressource.unite) : "",
      String(ligne.quantite),
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
          const align = colIndex === 2 ? styles.designationCell : null;
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topline}>
          <Text>FANALAMANGA S.A. — Approvisionnement</Text>
          <Text>Date : {formatDateLong(demandeAchat.dateDemandeAchat)}</Text>
        </View>

        <View style={styles.titleRow}>
          <Image src={FanalamangaLogo} style={styles.logoImg} />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              DEMANDE D&apos;ACHAT N°{demandeAchat.numeroDemandeAchat}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <InfoLine label="N° approvisionnement" value={appro?.numeroApprovisionnement} />
          <InfoLine
            label="Date"
            value={appro ? formatDateLong(appro.dateApprovisionnement) : ""}
          />
          <InfoLine label="Objet du bon de magasin" value={bon?.objet} />
          <InfoLine label="Commentaire" value={appro?.commentaireApprovisionnement} />
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            {TABLE_HEADERS.map((label, index) => {
              const isLastCol = index === TABLE_HEADERS.length - 1;
              return (
                <View
                  key={label}
                  style={[
                    styles.cell,
                    styles.header,
                    ...(isLastCol ? [styles.cellLast] : []),
                    { width: `${COLUMNS[index].widthPct}%` },
                  ]}
                >
                  <Text>{label}</Text>
                </View>
              );
            })}
          </View>
          {lignes.length === 0 ? (
            <View style={styles.row}>
              <View style={[styles.cell, styles.cellLast, { width: "100%" }]}>
                <Text style={styles.emptyCell}>—</Text>
              </View>
            </View>
          ) : (
            lignes.map((ligne, index) => renderItemsRow(ligne, index))
          )}
        </View>
      </Page>
    </Document>
  );
};

export default DemandeAchatPdf;
