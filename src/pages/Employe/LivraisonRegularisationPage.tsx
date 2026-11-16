import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircleX, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageActionBar from "@/components/ui/PageActionBar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import LivraisonStatutBadge from "@/components/status/LivraisonStatutBadge";
import StatutReceptionBadge from "@/components/status/StatutReceptionBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetAnomaliesParSortie } from "@/hooks/useGetAnomaliesParSortie";
import { useRegulariserReception } from "@/hooks/useRegulariserReception";
import { LigneSortieInterface } from "@/interfaces/BonSortie";
import { RegularisationFormInterface } from "@/interfaces/Reception";
import { RegularisationValidation } from "@/validation/regularisation.validation";
import { formatDate } from "@/utils/Date";
import { pluriel } from "@/utils/Pluriel";
import { getRessource } from "@/utils/Ressource";

const LivraisonRegularisationPage: React.FC = () => {
  const navigate = useNavigate();
  const { sortieId, receptionId } = useParams<{
    sortieId: string;
    receptionId: string;
  }>();
  const { data, isLoading, isError } = useGetAnomaliesParSortie(sortieId);
  const { mutateAsync: regulariser, isPending } = useRegulariserReception();

  const anomalie = data.anomalies.find(
    (item) => item.reception?._id === receptionId,
  );
  const livraison = anomalie?.livraison ?? null;
  const reception = anomalie?.reception ?? null;
  const lignesNonRecues = anomalie?.anomalies.lignesNonRecues ?? [];
  const receptionNonConforme = anomalie?.anomalies.receptionNonConforme ?? false;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegularisationFormInterface>({
    resolver: yupResolver(RegularisationValidation),
    defaultValues: {
      regulariserReception: false,
      lignes: [],
      motif: "",
      commentaire: "",
    },
  });

  useEffect(() => {
    if (!anomalie) {
      return;
    }
    reset({
      regulariserReception: false,
      lignes: anomalie.anomalies.lignesNonRecues.map((ligne) => ({
        ligneId: ligne._id,
        selectionne: false,
        quantiteRegularisee: "",
      })),
      motif: "",
      commentaire: "",
    });
  }, [anomalie, reset]);

  const lignesForm = watch("lignes") ?? [];
  const receptionSelectionnee = watch("regulariserReception");
  const lignesSelectionnees = lignesForm.filter((ligne) => ligne.selectionne);
  const totalAnomalies =
    (receptionNonConforme ? 1 : 0) + lignesNonRecues.length;

  const handleRegulariser = async (values: RegularisationFormInterface) => {
    if (!reception?._id || !livraison) {
      return;
    }
    const lignes = values.lignes
      .filter((ligne) => ligne.selectionne)
      .map((ligne) => ({
        ligneId: ligne.ligneId,
        quantiteRegularisee:
          ligne.quantiteRegularisee === "" ||
          ligne.quantiteRegularisee === undefined
            ? undefined
            : Number(ligne.quantiteRegularisee),
      }));
    try {
      await regulariser({
        receptionId: reception._id,
        data: {
          regulariserReception: values.regulariserReception || undefined,
          lignes: lignes.length > 0 ? lignes : undefined,
          motif: values.motif.trim(),
          commentaire: values.commentaire?.trim() || undefined,
        },
      });
      navigate(`/employe/livraison/view/${livraison._id}`);
    } catch {
      return;
    }
  };

  if (isLoading) {
    return (
      <div className='panel p-10 flex flex-col items-center justify-center gap-3'>
        <LoadingOutlined className='text-3xl text-brand' />
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  if (isError || !anomalie || !livraison || !reception) {
    return (
      <div className='panel p-8 flex flex-col items-center justify-center gap-3 text-center'>
        <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
          <CircleX className='w-6 h-6' />
        </div>
        <p className='text-sm text-gray-600'>
          Les anomalies de cette livraison sont introuvables ou ont déjà été
          régularisées.
        </p>
        <Button
          type='button'
          variant='outline'
          onClick={() => navigate("/employe/livraison/scan")}
        >
          Scanner un autre bon de sortie
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col pb-14'>
      <form className='flex flex-col' onSubmit={handleSubmit(handleRegulariser)}>
        <div className='w-full panel p-5 flex items-center gap-5'>
          <div className='grid place-items-center size-14 rounded-lg bg-amber-50 text-amber-600 shrink-0'>
            <RefreshCw className='w-7 h-7' />
          </div>
          <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
            <h1 className='text-lg font-bold truncate flex items-center gap-2'>
              <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700'>
                {livraison.numeroLivraison}
              </span>
              <span className='truncate'>Régulariser la livraison</span>
            </h1>
            <div className='flex items-center gap-2 flex-wrap'>
              <LivraisonStatutBadge statut={livraison.statutLivraison} />
              <StatutReceptionBadge statut={livraison.statutReception} />
              <span className='text-xs text-muted-foreground'>
                {totalAnomalies}{" "}
                {pluriel(totalAnomalies, "anomalie", "anomalies")}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-5 panel flex flex-col overflow-hidden rounded-lg'>
          <div className='border-b border-brand-border px-5 py-4'>
            <h2 className='text-sm font-semibold text-gray-700'>
              Anomalies détectées lors de la réception
            </h2>
            <p className='mt-1 text-xs text-muted-foreground'>
              Sélectionnez uniquement les anomalies réellement corrigées. La
              régularisation est définitive et conserve l’historique.
            </p>
          </div>

          {receptionNonConforme ? (
            <label className='flex items-start gap-3 border-b border-brand-border px-5 py-4 cursor-pointer hover:bg-muted/30'>
              <input
                type='checkbox'
                {...register("regulariserReception")}
                className='mt-1 size-4 shrink-0 accent-amber-600 border rounded-md'
              />
              <span className='flex flex-col gap-1'>
                <span className='text-sm font-semibold text-gray-700'>
                  Réception non conforme
                </span>
                <span className='text-xs text-muted-foreground'>
                  Réception n° {reception.numeroReception} du{" "}
                  {formatDate(reception.dateReception)}. Cocher pour la marquer
                  comme régularisée et conforme.
                </span>
              </span>
            </label>
          ) : (
            <div className='border-b border-brand-border px-5 py-4 text-sm text-muted-foreground'>
              {reception.statutConformite === "regularisee"
                ? "La réception est déjà régularisée : aucune régularisation de conformité n’est nécessaire."
                : "La réception est conforme : aucune régularisation de conformité n’est nécessaire."}
            </div>
          )}

          <div className='overflow-auto max-h-[420px]'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50/80 sticky top-0 z-10'>
                <tr className='border-b border-brand-border'>
                  <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                    Ressource non reçue
                  </th>
                  <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                    Quantité sortie
                  </th>
                  <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>
                    Quantité régularisée
                  </th>
                </tr>
              </thead>
              <tbody>
                {lignesNonRecues.length > 0 ? (
                  lignesNonRecues.map(
                    (ligne: LigneSortieInterface, index: number) => {
                      const ressource = getRessource(
                        ligne.ligneBonMagasin?.ligneDemande?.ressource,
                      );
                      const selectionnee =
                        lignesForm[index]?.selectionne ?? false;
                      return (
                        <tr
                          key={ligne._id}
                          className={`border-b border-[#f1f5f9] border-l-2 transition-colors last:border-b-0 ${
                            selectionnee
                              ? "border-l-amber-500 bg-amber-50/40"
                              : "border-l-transparent hover:bg-muted/40"
                          }`}
                        >
                          <td className='px-4 py-3'>
                            <label className='flex items-start gap-3 cursor-pointer'>
                              <input
                                type='checkbox'
                                checked={selectionnee}
                                onChange={(event) =>
                                  setValue(
                                    `lignes.${index}.selectionne`,
                                    event.target.checked,
                                    { shouldValidate: true },
                                  )
                                }
                                className='mt-1 size-4 shrink-0 accent-amber-600 border rounded-md'
                              />
                              {ressource ? (
                                <span className='flex flex-col gap-1'>
                                  <span className='font-medium text-foreground'>
                                    <span className='mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                                      {ressource.reference}
                                    </span>
                                    {ressource.designationRessource}
                                  </span>
                                  <RessourceCategorieBadge
                                    categorie={ressource.categorie}
                                  />
                                </span>
                              ) : (
                                <span className='text-muted-foreground'>
                                  Ressource inconnue
                                </span>
                              )}
                            </label>
                          </td>
                          <td className='px-4 py-3 text-right whitespace-nowrap font-semibold text-gray-700'>
                            {ligne.quantiteLigneSortie}
                            {ressource?.unite && (
                              <span className='ml-1 font-normal text-gray-500'>
                                {getUniteLabel(ressource.unite)}
                              </span>
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            {selectionnee ? (
                              <input
                                type='number'
                                min={0}
                                step='any'
                                placeholder={String(ligne.quantiteLigneSortie)}
                                {...register(
                                  `lignes.${index}.quantiteRegularisee`,
                                  {
                                    setValueAs: (value) =>
                                      value === "" ? "" : Number(value),
                                  },
                                )}
                                className='h-9 w-full min-w-[120px] rounded-md border border-brand-border bg-white px-2 text-sm'
                              />
                            ) : (
                              <span className='text-muted-foreground'>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className='px-4 py-10 text-center text-muted-foreground'
                    >
                      Aucune ressource non reçue à régulariser.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {errors.lignes?.root?.message && (
            <div className='px-5 py-3 text-xs text-red-500 border-t border-brand-border'>
              {errors.lignes.root.message}
            </div>
          )}
        </div>

        <div className='mt-5 panel p-5'>
          <div>
            <Label
              htmlFor='motif-regularisation'
              className='mb-1.5 block text-[13px] font-semibold'
            >
              Motif de régularisation
            </Label>
            <Textarea
              id='motif-regularisation'
              rows={3}
              maxLength={500}
              {...register("motif")}
              placeholder='Expliquez la raison de la régularisation…'
            />
            {errors.motif && (
              <div className='mt-1 text-xs text-red-500'>
                {errors.motif.message}
              </div>
            )}
          </div>
          <div className='mt-4'>
            <Label
              htmlFor='commentaire-regularisation'
              className='mb-1.5 block text-[13px] font-semibold'
            >
              Commentaire (facultatif)
            </Label>
            <Textarea
              id='commentaire-regularisation'
              rows={3}
              maxLength={500}
              {...register("commentaire")}
              placeholder='Précisions complémentaires…'
            />
            {errors.commentaire && (
              <div className='mt-1 text-xs text-red-500'>
                {errors.commentaire.message}
              </div>
            )}
          </div>
          {errors.root?.message && (
            <div className='mt-3 text-xs text-red-500'>
              {errors.root.message}
            </div>
          )}
        </div>

        <div className='mt-5 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700'>
          Cette action est définitive. Les états précédents sont conservés dans
          l’historique de régularisation.
        </div>

        <PageActionBar>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate(`/employe/livraison/view/${livraison._id}`)}
            disabled={isPending}
            className='shrink-0 shadow-md'
          >
            Annuler
          </Button>
          <Button
            type='submit'
            variant='brand'
            disabled={
              isPending ||
              (!receptionSelectionnee && lignesSelectionnees.length === 0)
            }
            className='shrink-0 shadow-md'
          >
            {isPending ? <LoadingOutlined /> : <RefreshCw className='size-4' />}
            {isPending ? "Régularisation…" : "Régulariser"}
          </Button>
        </PageActionBar>
      </form>
    </div>
  );
};

export default LivraisonRegularisationPage;
