import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Info, PackageSearch, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageActionBar from "@/components/ui/PageActionBar";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetApprovisionnement } from "@/hooks/useGetApprovisionnement";
import { useGetBonMagasin } from "@/hooks/useGetBonMagasin";
import { useVerifierStock } from "@/hooks/useVerifierStock";
import { useCreateDemandeAchat } from "@/hooks/useCreateDemandeAchat";
import { useGetDemandeAchatByAppro } from "@/hooks/useGetDemandeAchatByAppro";
import { LigneBonMagasinInterface } from "@/interfaces/BonMagasin";
import { RessourceRef } from "@/interfaces/Demande";
import { ManageDemandeAchatFormInterface } from "@/interfaces/DemandeAchat";
import { DemandeAchatValidation } from "@/validation/demandeachat.validation";
import { getRessource, getReference } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const getRessourceId = (
  ressource: RessourceRef | string | null | undefined,
): string | null => {
  if (!ressource) return null;
  return typeof ressource === "string" ? ressource : (ressource._id ?? null);
};

const DemandeAchatCreatePage: React.FC = () => {
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
  } = useForm<ManageDemandeAchatFormInterface>({
    resolver: yupResolver(DemandeAchatValidation),
    defaultValues: {
      approvisionnementId: approvisionnementId ?? "",
      lignes: [],
    },
  });

  const { fields } = useFieldArray({ control, name: "lignes" });

  const ligneErreurs = errors.lignes as unknown as
    | Array<{ quantite?: { message?: string } }>
    | undefined;

  const lignesBon: LigneBonMagasinInterface[] = bon?.lignes ?? [];

  const lignesTransmises = lignesBon.filter(
    (ligne) => ligne.statutLigneBonMagasin === "transmis",
  );

  const references = Array.from(
    new Set(
      lignesTransmises
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

  const quantiteStockParRef = new Map<string, number>();
  references.forEach((reference: string) => {
    const stock = stocks.find((s: any) => s.reference === reference);
    quantiteStockParRef.set(
      reference,
      stock && typeof stock.quantiteStock === "number" ? stock.quantiteStock : 0,
    );
  });

  const lignesACommander = lignesTransmises
    .map((ligne) => {
      const reference = getReference(ligne.ligneDemande?.ressource);
      const quantiteBon = ligne.quantiteLigneBonMagasin;
      const quantiteStock = quantiteStockParRef.get(reference) ?? 0;
      const quantite = Math.max(0, quantiteBon - quantiteStock);
      return { ligne, reference, quantiteBon, quantiteStock, quantite };
    })
    .filter((item) => item.reference && item.quantite > 0);

  useEffect(() => {
    if (bon?._id && stocksPrets) {
      reset({
        approvisionnementId: approvisionnementId ?? "",
        lignes: lignesACommander
          .map((item) => {
            const ressourceId = getRessourceId(
              item.ligne.ligneDemande?.ressource,
            );
            if (!ressourceId) return null;
            return {
              ressourceId,
              quantite: item.quantite,
              inclure: true,
            };
          })
          .filter(Boolean) as ManageDemandeAchatFormInterface["lignes"],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bon?._id, stocksPrets]);

  const { data: demandeAchatExistante } = useGetDemandeAchatByAppro(
    approvisionnementId,
  );

  const { mutateAsync: creerDemandeAchat, isPending: isCreating } =
    useCreateDemandeAchat({
      action: () => navigate("/agent_appro/demande-achat"),
    });

  const handleCreer = async (values: ManageDemandeAchatFormInterface) => {
    if (!approvisionnementId) {
      return;
    }
    const lignes = values.lignes
      .filter((ligne) => ligne.inclure && Number(ligne.quantite) > 0)
      .map((ligne) => ({
        ressourceId: ligne.ressourceId,
        quantite: Number(ligne.quantite),
      }));
    if (lignes.length === 0) {
      return;
    }
    try {
      await creerDemandeAchat({ approvisionnementId, lignes });
    } catch {
      return;
    }
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

  if (enChargement) {
    return (
      <div className="panel p-10 flex flex-col items-center justify-center gap-3">
        <LoadingOutlined className="text-3xl text-brand" />
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (enErreur) {
    return (
      <div className="flex justify-center py-16 text-center text-red-500">
        {verifierStock.isError
          ? "La récupération du stock a échoué."
          : !approvisionnement
            ? "Approvisionnement introuvable."
            : !approvisionnement.bonMagasin
              ? "Aucun bon de magasin n'est lié à cet approvisionnement."
              : "Le bon de magasin lié à cet approvisionnement est introuvable."}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full panel p-5 flex items-center gap-5">
        <div className="grid place-items-center size-14 rounded-lg bg-orange-50 text-orange-600 shrink-0">
          <ShoppingCart className="w-7 h-7" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
          <h1 className="text-lg font-bold truncate flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700">
              {approvisionnement.numeroApprovisionnement}
            </span>
            <span className="truncate">Établir une demande d'achat</span>
          </h1>
          <div className="text-sm text-muted-foreground">
            {bon?.objet || approvisionnement.bonMagasin?.objet || "—"}
          </div>
        </div>
      </div>

      {demandeAchatExistante ? (
        <div className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Une demande d'achat a déjà été créée pour cet approvisionnement.
        </div>
      ) : lignesACommander.length === 0 ? (
        <div className="mt-5 panel p-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="grid place-items-center size-12 rounded-lg bg-teal-50 text-teal-600">
            <PackageSearch className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-600">
            Aucune ressource en insuffisance de stock : aucune demande d'achat
            n'est nécessaire.
          </p>
        </div>
      ) : (
        <form
          className="mt-5 flex flex-col gap-5 pb-14"
          onSubmit={handleSubmit(handleCreer)}
        >
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              Les ressources ci-dessous sont en insuffisance de stock. Ajustez les
              quantités et décochez celles à ne pas commander.
            </span>
          </div>

          <div className="panel flex flex-col overflow-hidden rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="text-sm font-semibold text-gray-700">
                {pluriel(fields.length, "Ressource à commander", "Ressources à commander")}{" "}
                <span className="ml-1 text-muted-foreground font-normal">
                  ({fields.length})
                </span>
              </h2>
            </div>
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 sticky top-0 z-10">
                  <tr className="border-b border-brand-border">
                    <th className="px-4 py-3 text-center align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Inclure</th>
                    <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Ressource</th>
                    <th className="px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Quantité bon</th>
                    <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Quantité à commander</th>
                    <th className="px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground">Unité</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.length > 0 ? (
                    fields.map((field, index) => {
                      const item = lignesACommander.find(
                        (l) =>
                          getRessourceId(l.ligne.ligneDemande?.ressource) ===
                          field.ressourceId,
                      );
                      const ressource = getRessource(
                        item?.ligne.ligneDemande?.ressource,
                      );
                      return (
                        <tr
                          key={field.id}
                          className="border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0"
                        >
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              className="size-4 accent-[var(--color-brand)]"
                              {...register(`lignes.${index}.inclure`)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="hidden"
                              {...register(`lignes.${index}.ressourceId`)}
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
                            {item?.quantiteBon ?? "—"}
                          </td>
                          <td className="px-4 py-3 w-[18%]">
                            <Input
                              type="number"
                              min={1}
                              step="any"
                              {...register(`lignes.${index}.quantite`, {
                                valueAsNumber: true,
                              })}
                            />
                            {ligneErreurs?.[index]?.quantite?.message && (
                              <div className="text-xs text-red-500 text-left w-full mt-1">
                                {ligneErreurs[index].quantite.message}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            {ressource?.unite ? getUniteLabel(ressource.unite) : "—"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <td colSpan={5} className="p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted">
                        Aucune ressource à commander
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {((errors.lignes as unknown as { message?: string })?.message as
            | string
            | undefined) && (
            <div className="text-sm text-red-500">
              {(errors.lignes as unknown as { message?: string }).message}
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
            <Button
              type="submit"
              variant="brand"
              className="shadow-md"
              disabled={isCreating}
            >
              {isCreating ? <LoadingOutlined /> : <ShoppingCart className="size-4" />}
              Créer la demande d'achat
            </Button>
          </PageActionBar>
        </form>
      )}
    </div>
  );
};

export default DemandeAchatCreatePage;
