import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { PackageCheck, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import PageActionBar from "@/components/ui/PageActionBar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import LivraisonStatutBadge from "@/components/status/LivraisonStatutBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetLivraison } from "@/hooks/useGetLivraison";
import { useCreateReception } from "@/hooks/useCreateReception";
import { LigneSortieInterface } from "@/interfaces/BonSortie";
import { ManageReceptionInterface } from "@/interfaces/Reception";
import { ReceptionValidation } from "@/validation/reception.validation";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const ReceptionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: livraison, isLoading, isError } = useGetLivraison(id);
  const { mutateAsync: recevoir, isPending } = useCreateReception();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ManageReceptionInterface>({
    resolver: yupResolver(ReceptionValidation),
    defaultValues: {
      livraisonId: id ?? "",
      lignesRecues: [],
      estConforme: true,
      commentaireReception: "",
      commentaireLivraison: "",
    },
  });

  useEffect(() => {
    if (id) {
      setValue("livraisonId", id);
    }
  }, [id, setValue]);

  const lignesEligibles: LigneSortieInterface[] = (livraison?.lignes ?? []).filter(
    (ligne: LigneSortieInterface) => ligne.statutLigneSortie === "en_livraison",
  );

  const lignesRecues = watch("lignesRecues") ?? [];

  const toutesSelectionnees =
    lignesEligibles.length > 0 &&
    lignesEligibles.every((ligne) => lignesRecues.includes(ligne._id));

  const toggleLigne = (ligneId: string) => {
    const next = new Set(lignesRecues);
    if (next.has(ligneId)) {
      next.delete(ligneId);
    } else {
      next.add(ligneId);
    }
    setValue("lignesRecues", Array.from(next), { shouldValidate: true });
  };

  const basculerTout = () => {
    setValue(
      "lignesRecues",
      toutesSelectionnees
        ? []
        : lignesEligibles.map((ligne) => ligne._id),
      { shouldValidate: true },
    );
  };

  const peutRecevoir =
    livraison?.statutLivraison === "en_cours" && !livraison?.reception;

  const handleRecevoir = async (values: ManageReceptionInterface) => {
    if (!id || !peutRecevoir) {
      return;
    }
    try {
      await recevoir({
        livraisonId: id,
        lignesRecues: values.lignesRecues,
        estConforme: values.estConforme,
        commentaireReception: values.commentaireReception?.trim() || undefined,
        commentaireLivraison: values.commentaireLivraison?.trim() || undefined,
      });
      navigate(`/employe/livraison/view/${id}`);
    } catch {
      return;
    }
  };

  return (
    <div className='flex flex-col pb-14'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !livraison ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement de la livraison.
        </div>
      ) : (
        <form className='flex flex-col' onSubmit={handleSubmit(handleRecevoir)}>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <Truck className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate flex items-center gap-2'>
                <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700'>
                  {livraison.numeroLivraison}
                </span>
                <span className='truncate'>Réceptionner la livraison</span>
              </h1>
              <div className='flex items-center gap-2 flex-wrap'>
                <LivraisonStatutBadge statut={livraison.statutLivraison} size='md' />
              </div>
            </div>
          </div>

          {!peutRecevoir && (
            <div className='mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700'>
              Cette livraison ne peut plus être réceptionnée (elle a déjà été
              réceptionnée ou n'est plus en cours).
            </div>
          )}

          <div className='mt-5 panel flex flex-col overflow-hidden rounded-lg'>
            <div className='flex flex-wrap items-center justify-between gap-3 border-b border-brand-border px-5 py-4'>
              <h2 className='text-sm font-semibold text-gray-700'>
                Sélectionnez les ressources réellement reçues
                <span className='ml-2 text-muted-foreground font-normal'>
                  ({lignesRecues.length}/{lignesEligibles.length} {pluriel(lignesRecues.length, "sélectionnée", "sélectionnées")})
                </span>
              </h2>
              {lignesEligibles.length > 0 && (
                <button
                  type='button'
                  onClick={basculerTout}
                  className='text-sm font-semibold text-brand hover:underline'
                >
                  {toutesSelectionnees
                    ? "Tout désélectionner"
                    : "Tout sélectionner"}
                </button>
              )}
            </div>
            <div className='overflow-auto max-h-[420px]'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50/80 sticky top-0 z-10'>
                  <tr className='border-b border-brand-border'>
                    <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                    <th className='px-4 py-3 text-right align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité sortie</th>
                    <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Unité</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesEligibles.length > 0 ? (
                    lignesEligibles.map((ligne: LigneSortieInterface) => {
                      const ressource = getRessource(
                        ligne.ligneBonMagasin?.ligneDemande?.ressource,
                      );
                      const isSelected = lignesRecues.includes(ligne._id);
                      return (
                        <tr
                          key={ligne._id}
                          className={`border-b border-[#f1f5f9] border-l-2 transition-colors last:border-b-0 ${
                            isSelected
                              ? "border-l-[#16a34a] bg-[#e9f5ee]/40"
                              : "border-l-transparent hover:bg-muted/40"
                          }`}
                        >
                          <td className='px-4 py-3'>
                            <label className='flex items-start gap-3 cursor-pointer'>
                              <input
                                type='checkbox'
                                checked={isSelected}
                                onChange={() => toggleLigne(ligne._id)}
                                className='mt-1 size-4 shrink-0 accent-green-600 border rounded-md'
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
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
                            {ressource?.unite
                              ? getUniteLabel(ressource.unite)
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-b transition-colors hover:bg-muted/50'>
                      <td
                        colSpan={3}
                        className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'
                      >
                        Aucune ressource en attente de réception
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {errors.lignesRecues && (
              <div className='px-5 py-3 text-xs text-red-500 border-t border-brand-border'>
                {errors.lignesRecues.message}
              </div>
            )}
          </div>

          <div className='mt-5 panel p-5'>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                {...register("estConforme")}
                className='mt-0.5 size-4 shrink-0 accent-green-600 border rounded-md'
              />
              <span>
                <span className='block text-[13px] font-semibold text-gray-700'>
                  Ressources conformes
                </span>
                <span className='block text-xs text-muted-foreground'>
                  Décochez si les ressources reçues ne sont pas conformes.
                </span>
              </span>
            </label>

            <div className='mt-4'>
              <Label
                htmlFor='commentaire-reception'
                className='mb-1.5 block text-[13px] font-semibold'
              >
                Commentaire (facultatif)
              </Label>
              <Textarea
                id='commentaire-reception'
                rows={3}
                maxLength={500}
                {...register("commentaireReception")}
                placeholder='Précisions sur la réception…'
              />
              {errors.commentaireReception && (
                <div className='mt-1 text-xs text-red-500'>
                  {errors.commentaireReception.message}
                </div>
              )}
            </div>

            <div className='mt-4'>
              <Label
                htmlFor='commentaire-livraison'
                className='mb-1.5 block text-[13px] font-semibold'
              >
                Commentaire de livraison (facultatif)
              </Label>
              <Textarea
                id='commentaire-livraison'
                rows={3}
                maxLength={500}
                {...register("commentaireLivraison")}
                placeholder='Précisions sur la livraison…'
              />
              {errors.commentaireLivraison && (
                <div className='mt-1 text-xs text-red-500'>
                  {errors.commentaireLivraison.message}
                </div>
              )}
            </div>
          </div>

          <div className='mt-5 rounded-lg bg-sky-50 px-4 py-3 text-xs text-sky-700'>
            Les ressources non sélectionnées seront marquées « Non reçu » et ne
            pourront plus être réceptionnées.
          </div>

          <PageActionBar>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate(`/employe/livraison/view/${id}`)}
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
                !peutRecevoir ||
                lignesRecues.length === 0 ||
                lignesEligibles.length === 0
              }
              className='shrink-0 shadow-md'
            >
              {isPending ? <LoadingOutlined /> : <PackageCheck className='size-4' />}
              {isPending ? "Enregistrement…" : "Recevoir"}
            </Button>
          </PageActionBar>
        </form>
      )}
    </div>
  );
};

export default ReceptionCreatePage;
