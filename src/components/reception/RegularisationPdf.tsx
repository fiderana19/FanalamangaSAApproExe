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
    fontSize: 13,
    fontFamily: "Times-Roman",
    color: INK,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoImg: { width: 54, height: 54, marginRight: 10 },
  companyStrong: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.25,
    letterSpacing: 0.2,
  },
  companyLine: { fontSize: 12, lineHeight: 1.25, letterSpacing: 0.2 },
  date: { fontSize: 12, paddingTop: 2 },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.4,
    marginTop: 36,
    marginBottom: 18,
  },
  meta: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    marginBottom: 18,
  },
  metaRow: { flexDirection: "row", marginBottom: 4 },
  metaLabel: { width: 130, fontWeight: "bold" },
  metaValue: { flex: 1 },
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: BORDER,
  },
  row: { flexDirection: "row" },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 6,
    paddingHorizontal: 7,
    minHeight: 30,
    justifyContent: "center",
  },
  headerCell: { fontWeight: "bold", textAlign: "center" },
  textLeft: { textAlign: "left" },
  textCenter: { textAlign: "center" },
  signatures: { flexDirection: "row", marginTop: 22 },
  signatureCol: { justifyContent: "flex-start" },
  signatureRight: { alignItems: "center" },
  signTitle: { fontSize: 13, fontWeight: "bold" },
  signSpace: { height: 68 },
});

const COLUMNS = [
  { label: "N°", widthPct: 7, center: true },
  { label: "DÉSIGNATION", widthPct: 43, center: false },
  { label: "UTE", widthPct: 10, center: true },
  { label: "QTE", widthPct: 10, center: true },
  { label: "DATE EFFECTIVE", widthPct: 16, center: true },
  { label: "MOTIF", widthPct: 14, center: false },
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

interface RegularisationPdfProps {
  livraison: LivraisonInterface;
}

const RegularisationPdf: React.FC<RegularisationPdfProps> = ({ livraison }) => {
  const reception = livraison.reception;
  const service =
    livraison.sortie?.approvisionnement?.bonMagasin?.demande?.demandeur
      ?.service;
  const lieu = service?.lieuService || "—";
  const lignes = (livraison.lignes ?? []).filter(
    (ligne: LigneSortieInterface) =>
      ligne.statutLigneSortie === "regularise",
  );
  const auteur =
    reception?.utilisateurRegularisation ??
    lignes.find((ligne) => ligne.utilisateurRegularisation)
      ?.utilisateurRegularisation ??
    null;
  const motif =
    reception?.motifRegularisation ??
    lignes.find((ligne) => ligne.motifRegularisation)?.motifRegularisation ??
    "";
  const commentaire =
    reception?.commentaireRegularisation ??
    "";
  const dateRegularisation =
    reception?.dateRegularisation ??
    lignes.find((ligne) => ligne.dateRegularisation)?.dateRegularisation ??
    livraison.dateRegularisation ??
    null;

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
            {lieu}, le {formatDateLong(dateRegularisation)}
          </Text>
        </View>

        <Text style={styles.title}>
          BON DE RÉGULARISATION&nbsp; N° {livraison.numeroLivraison}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Livraison :</Text>
            <Text style={styles.metaValue}>{livraison.numeroLivraison}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Réception :</Text>
            <Text style={styles.metaValue}>
              {reception?.numeroReception ?? "—"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date de régularisation :</Text>
            <Text style={styles.metaValue}>
              {formatDateLong(dateRegularisation)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Régularisé par :</Text>
            <Text style={styles.metaValue}>
              {auteur ? `${auteur.nom ?? ""} ${auteur.prenom ?? ""}`.trim() : "—"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Réception régularisée :</Text>
            <Text style={styles.metaValue}>
              {reception?.statutConformite === "regularisee" ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Motif :</Text>
            <Text style={styles.metaValue}>{motif || "—"}</Text>
          </View>
          {commentaire?.trim() ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Commentaire :</Text>
              <Text style={styles.metaValue}>{commentaire}</Text>
            </View>
          ) : null}
        </View>

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
                <Text style={styles.textCenter}>
                  Aucune ressource régularisée
                </Text>
              </View>
            </View>
          ) : (
            lignes.map((ligne, index) => {
              const ressource = getRessource(
                ligne.ligneBonMagasin?.ligneDemande?.ressource,
              );
              const values = [
                String(index + 1),
                ressource?.designationRessource ?? "",
                ressource?.unite ? getUniteLabel(ressource.unite) : "",
                String(
                  ligne.quantiteRegularisee ?? ligne.quantiteLigneSortie,
                ),
                formatDateLong(ligne.dateReceptionEffective),
                ligne.motifRegularisation ?? motif,
              ];
              return (
                <View key={ligne._id} style={styles.row}>
                  {values.map((value, colIndex) =>
                    renderCell(value, colIndex),
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={styles.signatures}>
          <View style={[styles.signatureCol, { width: "43%" }]}>
            <Text style={styles.signTitle}>LE REMETTANT</Text>
            <View style={styles.signSpace} />
          </View>
          <View
            style={[
              styles.signatureCol,
              styles.signatureRight,
              { width: "57%" },
            ]}
          >
            <Text style={styles.signTitle}>L’EMPLOYÉ</Text>
            <View style={styles.signSpace} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RegularisationPdf;
