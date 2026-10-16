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
import { LivraisonInterface } from "@/interfaces/Livraison";
import { LigneSortieInterface } from "@/interfaces/BonSortie";
import { getRessource } from "@/utils/Ressource";

const INK = "#1f2933";
const BORDER = "#59616a";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 42,
    fontSize: 14,
    fontFamily: "Times-Roman",
    color: INK,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImg: {
    width: 54,
    height: 54,
    marginRight: 10,
  },
  companyStrong: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.25,
    letterSpacing: 0.2,
  },
  companyLine: {
    fontSize: 12,
    lineHeight: 1.25,
    letterSpacing: 0.2,
  },
  date: {
    fontSize: 13,
    paddingTop: 2,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.4,
    marginTop: 42,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: BORDER,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 7,
    paddingHorizontal: 8,
    minHeight: 34,
    justifyContent: "center",
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  signatures: {
    flexDirection: "row",
    marginTop: 22,
  },
  signatureCol: {
    justifyContent: "flex-start",
  },
  signatureRight: {
    alignItems: "center",
  },
  signTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  signSpace: {
    height: 72,
  },
});

const COLUMNS = [
  { label: "N°", widthPct: 7, center: true },
  { label: "DÉSIGNATION", widthPct: 47, center: false },
  { label: "UTE", widthPct: 12, center: true },
  { label: "QTE", widthPct: 12, center: true },
  { label: "OBS", widthPct: 22, center: false },
] as const;

const formatDateLong = (iso?: string | null) => {
  if (!iso) {
    return "";
  }
  const parts = new Date(iso)
    .toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .split(" ");
  if (parts[1]) {
    parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return parts.join(" ");
};

interface ReceptionPdfProps {
  livraison: LivraisonInterface;
}

const ReceptionPdf: React.FC<ReceptionPdfProps> = ({ livraison }) => {
  const reception = livraison.reception;
  const service = livraison.sortie?.approvisionnement?.bonMagasin?.demande?.demandeur?.service;
  const lieu = service?.lieuService || "—";

  const lignes = (livraison.lignes ?? []).filter(
    (ligne: LigneSortieInterface) => ligne.statutLigneSortie !== "non_recu",
  );

  const renderCell = (value: string, colIndex: number) => {
    const column = COLUMNS[colIndex];
    return (
      <View
        key={colIndex}
        style={[styles.cell, { width: `${column.widthPct}%` }]}
      >
        <Text style={column.center ? styles.textCenter : styles.textLeft}>
          {value}
        </Text>
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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={FanalamangaLogo} style={styles.logoImg} />
            <View>
              <Text style={styles.companyStrong}>FANALAMANGA S.A.</Text>
              <Text style={styles.companyLine}>AGENCE {lieu}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {lieu}, le {formatDateLong(reception?.dateReception)}
          </Text>
        </View>

        <Text style={styles.title}>
          BON DE RÉCEPTION&nbsp; N° {reception?.numeroReception || "............./2026"}
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            {COLUMNS.map((column) => (
              <View
                key={column.label}
                style={[styles.cell, { width: `${column.widthPct}%` }]}
              >
                <Text style={styles.headerCell}>{column.label}</Text>
              </View>
            ))}
          </View>
          {lignes.length === 0 ? (
            <View style={styles.row}>
              <View style={[styles.cell, { width: "100%" }]}>
                <Text style={styles.textCenter}>Aucune ressource</Text>
              </View>
            </View>
          ) : (
            lignes.map(renderItemsRow)
          )}
        </View>

        <View style={styles.signatures}>
          <View style={[styles.signatureCol, { width: "43%" }]}>
            <Text style={styles.signTitle}>LE REMETTANT</Text>
            <View style={styles.signSpace} />
          </View>
          <View style={[styles.signatureCol, styles.signatureRight, { width: "57%" }]}>
            <Text style={styles.signTitle}>LE RÉCEPTIONNAIRE</Text>
            <View style={styles.signSpace} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReceptionPdf;
