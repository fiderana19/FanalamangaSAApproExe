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
import { BonSortieInterface, LigneSortieInterface } from "@/interfaces/BonSortie";
import { getRessource } from "@/utils/Ressource";

const INK = "#111820";
const BORDER = "#555";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 34,
    fontSize: 14,
    fontFamily: "Times-Roman",
    color: INK,
  },
  logoImg: {
    width: 62,
    height: 62,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  qrImg: {
    width: 72,
    height: 72,
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 18,
  },
  meta: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 1.95,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontWeight: "bold",
    width: 90,
  },
  metaBlank: {
    minWidth: 200,
  },
  row: {
    flexDirection: "row",
  },
  sectionLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    fontSize: 14,
  },
  th: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 3,
    height: 27,
    textAlign: "center",
    fontWeight: "normal",
  },
  td: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 3,
    height: 27,
    fontWeight: "normal",
    textAlign: "left",
  },
  tdCenter: {
    textAlign: "center",
  },
  signatures: {
    marginTop: 18,
  },
  sigTh: {
    height: 30,
    fontSize: 12,
    borderWidth: 1,
    borderColor: BORDER,
    textAlign: "center",
    fontWeight: "normal",
  },
  sigTd: {
    height: 75,
    borderWidth: 1,
    borderColor: BORDER,
  },
});

const COLUMNS = [
  { label: "N°", widthPct: 6, center: true },
  { label: "DÉSIGNATION", widthPct: 45, center: false },
  { label: "UNITÉ", widthPct: 10, center: false },
  { label: "QUANTITÉ", widthPct: 16, center: false },
  { label: "OBS", widthPct: 23, center: false },
] as const;

const SIGNATURES = [
  { label: "LE REPRÉSENTANT DU SERVICE DEMANDEUR", widthPct: 50 },
  { label: "LE MAGASINIER", widthPct: 50 },
] as const;

const formatDateLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

interface BonSortiePdfProps {
  bon: BonSortieInterface;
  qrCodeDataUrl?: string;
}

const BonSortiePdf: React.FC<BonSortiePdfProps> = ({ bon, qrCodeDataUrl }) => {
  const bonMagasin = bon.approvisionnement?.bonMagasin;
  const demande = bonMagasin?.demande;
  const demandeur = demande?.demandeur;
  const service = demandeur?.service;
  const direction = service?.direction;
  const serviceNom = service?.nomService || service?.sigleService || "—";
  const affectation = service?.lieuService || "—";

  const lignes = bon.lignes ?? [];

  const renderCell = (value: string, colIndex: number) => {
    const column = COLUMNS[colIndex];
    return (
      <View
        key={colIndex}
        style={[
          styles.td,
          ...(column.center ? [styles.tdCenter] : []),
          { width: `${column.widthPct}%` },
        ]}
      >
        <Text>{value}</Text>
      </View>
    );
  };

  const renderItemsRow = (ligne: LigneSortieInterface, index: number) => {
    const ressource = getRessource(ligne.ligneBonMagasin?.ligneDemande?.ressource);
    const values = [
      String(index + 1),
      ressource?.designationRessource ?? "",
      ressource?.unite ? getUniteLabel(ressource.unite) : "",
      String(ligne.quantiteLigneSortie),
      ligne.observation?.trim() ? ligne.observation : "",
    ];

    return (
      <View key={ligne._id} style={styles.row}>
        {values.map((value, colIndex) => renderCell(value, colIndex))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Image src={FanalamangaLogo} style={styles.logoImg} />
          {qrCodeDataUrl ? (
            <Image src={qrCodeDataUrl} style={styles.qrImg} />
          ) : null}
        </View>

        <Text style={styles.title}>
          BON DE SORTIE MAGASIN&nbsp; BSM N° {bon.numeroSortie || "............./2026"}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date :</Text>
            <Text style={styles.metaBlank}>{formatDateLong(bon.dateSortie)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Direction :</Text>
            <Text style={styles.metaBlank}>{direction || "—"}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Service :</Text>
            <Text style={styles.metaBlank}>{serviceNom}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Affectation :</Text>
            <Text style={styles.metaBlank}>{affectation}</Text>
          </View>
        </View>

        <View style={styles.sectionLine}>
          <Text>APUREMENT&nbsp; {bon.apurement === "total" ? "TOTAL" : "PARTIEL"}</Text>
          <Text>BM N° {bonMagasin?.numeroBonMagasin || "...................."}</Text>
          <Text>IMPUTATION</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.row}>
            {COLUMNS.map((column) => (
              <View
                key={column.label}
                style={[styles.th, { width: `${column.widthPct}%` }]}
              >
                <Text>{column.label}</Text>
              </View>
            ))}
          </View>
          {lignes.length === 0 ? (
            <View style={styles.row}>
              <View style={[styles.td, styles.tdCenter, { width: "100%" }]}>
                <Text>Aucune ressource</Text>
              </View>
            </View>
          ) : (
            lignes.map(renderItemsRow)
          )}
        </View>

        <View style={styles.signatures}>
          <View style={styles.row}>
            {SIGNATURES.map((signature) => (
              <View
                key={signature.label}
                style={[styles.sigTh, { width: `${signature.widthPct}%` }]}
              >
                <Text>{signature.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            {SIGNATURES.map((signature) => (
              <View
                key={signature.label}
                style={[styles.sigTd, { width: `${signature.widthPct}%` }]}
              />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BonSortiePdf;
