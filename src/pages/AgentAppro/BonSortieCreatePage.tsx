import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Info, PackageOpen, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageActionBar from "@/components/ui/PageActionBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import LigneBonMagasinStatutBadge from "@/components/status/LigneBonMagasinStatutBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetApprovisionnement } from "@/hooks/useGetApprovisionnement";
import { useGetBonMagasin } from "@/hooks/useGetBonMagasin";
import { useVerifierStock } from "@/hooks/useVerifierStock";
import { useCreerBonSortie } from "@/hooks/useCreerBonSortie";
import { useWithdrawStock } from "@/hooks/useWithdrawStock";
import { ManageBonSortieInterface } from "@/interfaces/BonSortie";
import { LigneBonMagasinInterface } from "@/interfaces/BonMagasin";
import { BonSortieValidation } from "@/validation/bonsortie.validation";
import { getRessource, getReference } from "@/utils/Ressource";
import { toLocalISOString } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";

const STATUTS_SORTIE = [
  "en_cours",
  "en_cours_partiel",
  "en_cours_achat",
  "achat_recu",
  "pret_a_livrer_en_cours_achat",
  "pret_a_livrer_achat_recu",
];

const BonSortieCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { approvisionnementId } = useParams<{
    approvisionnementId: string;
  }>();
  const {
    data: approvisionnement,
    isLoading: chargementAppro,
    isError: erreurAppro,
  } = useGetApprovisionnement(approvisionnementId);
  const {
    data: bon,
    isLoading: chargementBon,
    isError: erreurBon,
  } = useGetBonMagasin(approvisionnement?.bonMagasin?._id);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<ManageBonSortieInterface>({
    resolver: yupResolver(BonSortieValidation),
    defaultValues: {
      approvisionnementId: approvisionnementId ?? "",
      lignes: [],
    },
  });

  const { fields } = useFieldArray({ control, name: "lignes" });

  const ligneErreurs = errors.lignes as unknown as
    | Array<{ quantiteLigneSortie?: { message?: string } }>
    | undefined;

  const lignesBon: LigneBonMagasinInterface[] = bon?.lignes ?? [];

  const estLigneEligible = (ligne: LigneBonMagasinInterface) =>
    ligne.statutLigneBonMagasin === "transmis" ||
    ligne.statutLigneBonMagasin === "achat_recu";

  const lignesEligibles = lignesBon.filter(estLigneEligible);

  const references = Array.from(
    new Set(
      lignesEligibles
        .map((ligne) => getReference(ligne.ligneDemande?.ressource))
        .filter(Boolean),
    ),
  );

  const verifierStock = useVerifierStock();

  useEffect(() => {
    if (references.length > 0) {
      verifierStock.mutate(references);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bon?._id]);

  const stocks = verifierStock.data ?? [];
  const stocksPrets =
    references.length === 0 || verifierStock.data !== undefined;

  const estSuffisant = (ligne: LigneBonMagasinInterface): boolean => {
    if (ligne.statutLigneBonMagasin === "achat_recu") {
      return true;
    }
    const reference = getReference(ligne.ligneDemande?.ressource);
    if (!reference) {
      return false;
    }
    const stock = stocks.find((s: any) => s.reference === reference);
    return (
      !!stock &&
      typeof stock.quantiteStock === "number" &&
      stock.quantiteStock >= ligne.quantiteLigneBonMagasin
    );
  };

  const lignesDisponibles = lignesEligibles.filter(estSuffisant);
  const lignesIndisponibles = lignesEligibles.filter(
    (ligne) => !estSuffisant(ligne),
  );

  // Apurement dérivé pour ce bon de sortie uniquement : total s'il couvre
  // toutes les lignes du bon de magasin, sinon partiel.
  const apurementCalcule: "total" | "partiel" =
    lignesBon.length > 0 && lignesDisponibles.length === lignesBon.length
      ? "total"
      : "partiel";

  useEffect(() => {
    if (bon?._id && stocksPrets) {
      reset({
        approvisionnementId: approvisionnementId ?? "",
        apurement: apurementCalcule,
        lignes: lignesDisponibles.map((ligne) => ({
          ligneBonMagasinId: ligne._id,
          quantiteLigneSortie: ligne.quantiteLigneBonMagasin,
          observation: "",
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bon?._id, stocksPrets]);

  const peutEtablir = lignesDisponibles.length > 0;

  const withdrawStock = useWithdrawStock();
  const { mutateAsync: creerBonSortie, isPending: isCreating } =
    useCreerBonSortie();

  const handleCreer = async (values: ManageBonSortieInterface) => {
    if (!approvisionnementId || !peutEtablir) {
      return;
    }
    try {
      await creerBonSortie({
        ...values,
        dateSortie: toLocalISOString(new Date()),
      });
    } catch {
      return;
    }

    const quantitesParReference = new Map<string, number>();
    values.lignes.forEach((ligne) => {
      const ligneBon = lignesBon.find((l) => l._id === ligne.ligneBonMagasinId);
      const reference = getReference(ligneBon?.ligneDemande?.ressource);
      if (
        !reference ||
        !ligne.quantiteLigneSortie ||
        ligne.quantiteLigneSortie <= 0
      ) {
        return;
      }
      quantitesParReference.set(
        reference,
        (quantitesParReference.get(reference) ?? 0) + ligne.quantiteLigneSortie,
      );
    });

    const items = Array.from(
      quantitesParReference,
      ([reference, valeur]) => ({ reference, valeur }),
    );

    if (items.length > 0) {
      try {
        await withdrawStock.mutateAsync(items);
      } catch {
        // l'échec du stock est signalé par le hook, l'action métier est conservée
      }
    }

    navigate("/agent_appro/bon-sortie");
  };

  const stockEnCours =
    references.length > 0 &&
    verifierStock.isPending &&
    verifierStock.data === undefined;
  const enChargement = chargementAppro || chargementBon || stockEnCours;
  const enErreur =
    erreurAppro ||
    erreurBon ||
    verifierStock.isError ||
    !approvisionnement ||
    !bon;

  return (
    <div className="flex flex-col">
      {enChargement ? (
        <div className="flex justify-center py-16">
          <LoadingOutlined className="text-4xl text-brand" />
        </div>
      ) : enErreur ? (
        <div className="flex justify-center py-16 text-center text-red-500">
          {verifierStock.isError
            ? "La récupération du stock a échoué."
            : !approvisionnement
              ? "Approvisionnement introuvable."
              : !approvisionnement.bonMagasin
                ? "Aucun bon de magasin n'est lié à cet approvisionnement."
                : "Le bon de magasin lié à cet approvisionnement est introuvable."}
        </div>
      ) : (
        <>
          <div className="w-full panel p-5 flex items-center gap-5">
            <div className="grid place-items-center size-14 rounded-lg bg-teal-50 text-teal-600 shrink-0">
              <PackageOpen className="w-7 h-7" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
              <h1 className="text-lg font-bold truncate flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700">
                  {approvisionnement.numeroApprovisionnement}
                </span>
                <span className="truncate">Établir un bon de sortie de magasin</span>
              </h1>
              <div className="text-sm text-muted-foreground">
                {bon?.objet || approvisionnement.bonMagasin?.objet || "—"}
              </div>
            </div>
          </div>

          <form
            className="mt-5 flex flex-col gap-5 pb-14"
            onSubmit={handleSubmit(handleCreer)}
          >
            <div className="panel flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Type d'apurement
                </label>
                <Controller
                  control={control}
                  name="apurement"
                  defaultValue={apurementCalcule}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? apurementCalcule}
                      disabled
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner le type d'apurement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="partiel">Partiel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Déterminé automatiquement selon les lignes couvertes.
                </div>
                {errors.apurement && (
                  <div className="text-xs text-red-500">{errors.apurement.message}</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {lignesBon.length > lignesEligibles.length && (
                <div className="flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {lignesBon.length - lignesEligibles.length}{" "}
                    {pluriel(lignesBon.length - lignesEligibles.length, "ressource", "ressources")} déjà{" "}
                    {pluriel(lignesBon.length - lignesEligibles.length, "couverte", "couvertes")} par un
                    bon de sortie ou en cours d'achat : non{" "}
                    {pluriel(lignesBon.length - lignesEligibles.length, "reprise", "reprises")} ici.
                  </span>
                </div>
              )}
              {lignesIndisponibles.length > 0 && (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {lignesIndisponibles.length}{" "}
                  {pluriel(lignesIndisponibles.length, "ressource", "ressources")} en insuffisance de stock
                  : non{" "}
                  {pluriel(lignesIndisponibles.length, "reprise", "reprises")} ici. Utilisez «&nbsp;Faire
                  une demande d'achat&nbsp;» pour les commander.
                </div>
              )}
              <div className="panel flex flex-col overflow-hidden rounded-lg">
                <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {pluriel(lignesDisponibles.length, "Ressource disponible à sortir", "Ressources disponibles à sortir")}{" "}
                    <span className="ml-1 text-muted-foreground font-normal">
                      ({lignesDisponibles.length})
                    </span>
                  </h2>
                </div>
                <div className="overflow-auto max-h-[400px]">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 sticky top-0 z-10">
                      <tr className="border-b border-brand-border">
                        <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Ressource</th>
                        <th className="px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Quantité du bon</th>
                        <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Quantité</th>
                        <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Unité</th>
                        <th className="px-4 py-3 text-center align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Suivi</th>
                        <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.length > 0 ? (
                        fields.map((field, index) => {
                          const ligneBon = lignesBon.find(
                            (l) => l._id === field.ligneBonMagasinId,
                          );
                          const ressource = getRessource(
                            ligneBon?.ligneDemande?.ressource,
                          );
                          return (
                            <tr
                              key={field.id}
                              className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="hidden"
                                  {...register(`lignes.${index}.ligneBonMagasinId`)}
                                />
                                {ressource ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="font-medium text-foreground">
                                      <span className="mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                                        {ressource.reference}
                                      </span>
                                      {ressource.designationRessource}
                                    </span>
                                    <RessourceCategorieBadge categorie={ressource.categorie} />
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground" />
                                )}
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-gray-700">
                                {ligneBon?.quantiteLigneBonMagasin ?? "—"}
                              </td>
                              <td className="px-4 py-3 w-[15%]">
                                <Input
                                  type="number"
                                  min={1}
                                  step="any"
                                  {...register(`lignes.${index}.quantiteLigneSortie`, {
                                    valueAsNumber: true,
                                  })}
                                />
                                {ligneErreurs?.[index]?.quantiteLigneSortie?.message && (
                                  <div className="text-xs text-red-500 text-left w-full mt-1">
                                    {ligneErreurs[index].quantiteLigneSortie.message}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                {ressource?.unite ? getUniteLabel(ressource.unite) : "—"}
                              </td>
                              <td className="px-4 py-3 text-center whitespace-nowrap">
                                <LigneBonMagasinStatutBadge
                                  statut={ligneBon?.statutLigneBonMagasin}
                                />
                              </td>
                              <td className="px-4 py-3 w-[30%]">
                                <Input
                                  placeholder="Observation (optionnelle)"
                                  {...register(`lignes.${index}.observation`)}
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td colSpan={6} className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted">
                            Aucune ressource à sortir
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {!STATUTS_SORTIE.includes(approvisionnement.statutApprovisionnement) && (
              <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Cet approvisionnement ne peut plus faire l'objet d'un bon de sortie de magasin (statut : {approvisionnement.statutApprovisionnement}).
              </div>
            )}

            <PageActionBar>
              <Button
                type="button"
                variant="outline"
                className="shadow-md"
                onClick={() =>
                  navigate(
                    `/agent_appro/approvisionnement/view/${approvisionnementId}/verification-stock`,
                  )
                }
              >
                Annuler
              </Button>
              {lignesIndisponibles.length > 0 && (
                <Button
                  type="button"
                  variant="brand"
                  className="shadow-md"
                  onClick={() =>
                    navigate(`/agent_appro/demande-achat/create/${approvisionnementId}`)
                  }
                >
                  <ShoppingCart className="size-4" />
                  Faire une demande d'achat
                </Button>
              )}
              <Button
                type="submit"
                variant="brand"
                className="shadow-md"
                disabled={!peutEtablir || isCreating || withdrawStock.isPending}
              >
                {isCreating || withdrawStock.isPending ? (
                  <LoadingOutlined />
                ) : (
                  <PackageOpen className="size-4" />
                )}
                Établir le bon de sortie de magasin
              </Button>
            </PageActionBar>
          </form>
        </>
      )}
    </div>
  );
};

export default BonSortieCreatePage;
