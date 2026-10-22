import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Warehouse } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RessourceCategorieBadge from "@/components/ressources/RessourceCategorieBadge";
import { getUniteLabel } from "@/constants/RessourceUnite";
import { useGetDemande } from "@/hooks/useGetDemande";
import { useCreerBonMagasin } from "@/hooks/useCreerBonMagasin";
import { ManageBonMagasinInterface } from "@/interfaces/BonMagasin";
import { LigneDemandeInterface } from "@/interfaces/Demande";
import { BonMagasinValidation } from "@/validation/bonmagasin.validation";
import { getRessource } from "@/utils/Ressource";
import { pluriel } from "@/utils/Pluriel";

const nowLocal = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const BonMagasinCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: demande, isLoading, isError } = useGetDemande(id);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ManageBonMagasinInterface>({
    resolver: yupResolver(BonMagasinValidation),
    defaultValues: {
      demandeId: id ?? "",
      objet: "",
    },
  });

  const { mutateAsync: creerBonMagasin, isPending: isCreating } = useCreerBonMagasin();

  useEffect(() => {
    if (id) {
      setValue("demandeId", id);
    }
    if (demande) {
      setValue("objet", demande.motif);
    }
  }, [id, demande, setValue]);

  const lignesControlees: LigneDemandeInterface[] = (demande?.lignes ?? []).filter(
    (ligne: LigneDemandeInterface) => ligne.statutLigneDemande === "controlee",
  );

  const [observations, setObservations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (demande?._id && lignesControlees.length > 0) {
      setObservations((prev) => {
        const updated = { ...prev };
        for (const ligne of lignesControlees) {
          updated[ligne._id] = updated[ligne._id] ?? "";
        }
        return updated;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demande?._id]);

  const peutEtablir = demande?.statutActuelDemande === "controlee" && lignesControlees.length > 0;

  const handleCreer = async (values: ManageBonMagasinInterface) => {
    if (!id || !peutEtablir) {
      return;
    }
    try {
      const lignesObservations = lignesControlees.map((ligne) => ({
        ligneDemandeId: ligne._id,
        observation: observations[ligne._id] ?? "",
      }));
      await creerBonMagasin({
        ...values,
        dateBonMagasin: nowLocal(new Date()),
        lignesObservations,
      });
      navigate(`/employe/demande/view/${id}`);
    } catch {
      return;
    }
  };

  return (
    <div className='flex flex-col'>
      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingOutlined className='text-4xl text-brand' />
        </div>
      ) : isError || !demande ? (
        <div className='flex justify-center py-16 text-center text-red-500'>
          Une erreur est survenue lors du chargement de la demande.
        </div>
      ) : (
        <>
          <div className='w-full panel p-5 flex items-center gap-5'>
            <div className='grid place-items-center size-14 rounded-lg bg-gray-100 text-gray-700 shrink-0'>
              <Warehouse className='w-7 h-7' />
            </div>
            <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
              <h1 className='text-lg font-bold truncate flex items-center gap-2'>
                <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm font-semibold text-gray-700'>
                  {demande.numeroDemande}
                </span>
                <span className='truncate'>Établir un bon de magasin</span>
              </h1>
              <div className='text-sm text-muted-foreground'>{demande.motif}</div>
            </div>
          </div>

          <form className='mt-5 flex flex-col gap-5' onSubmit={handleSubmit(handleCreer)}>
            <div className='flex flex-col gap-5'>
              <div className='panel p-5'>
                <h2 className='text-sm font-semibold mb-3 text-gray-700'>Informations du bon</h2>
                <div className='grid gap-y-4 grid-cols-1'>
                  <div>
                    <Label htmlFor='objet' className='mb-1 block text-[13px] font-semibold'>
                      Objet
                    </Label>
                    <Input
                      id='objet'
                      placeholder='Objet du bon de magasin'
                      {...register("objet")}
                    />
                    {errors.objet && (
                      <div className='text-xs text-red-500 text-left w-full mt-1'>
                        {errors.objet.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='panel flex flex-col overflow-hidden rounded-lg'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-brand-border'>
                  <h2 className='text-sm font-semibold text-gray-700'>
                    {pluriel(lignesControlees.length, "Ressource contrôlée", "Ressources contrôlées")}{" "}
                    {lignesControlees.length > 0 && (
                      <span className='ml-1 text-muted-foreground font-normal'>
                        ({lignesControlees.length})
                      </span>
                    )}
                  </h2>
                </div>
                <div className='overflow-auto max-h-[400px]'>
                  <table className='w-full text-sm'>
                    <thead className='bg-gray-50/80 sticky top-0 z-10'>
                      <tr className='border-b border-brand-border'>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Ressource</th>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Quantité</th>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Unité</th>
                        <th className='px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-[11px] uppercase tracking-wider text-muted-foreground'>Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignesControlees.length > 0 ? (
                        lignesControlees.map((ligne) => {
                          const ressource = getRessource(ligne.ressource);
                          return (
                            <tr
                              key={ligne._id}
                              className='border-b border-[#f1f5f9] border-l-2 border-l-transparent transition-colors hover:bg-[#e9f5ee]/40 last:border-b-0'
                            >
                              <td className='px-4 py-3'>
                                {ressource ? (
                                  <div className='flex flex-col gap-1'>
                                    <span className='font-medium text-foreground'>
                                      <span className='mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700'>
                                        {ressource.reference}
                                      </span>
                                      {ressource.designationRessource}
                                    </span>
                                    <RessourceCategorieBadge categorie={ressource.categorie} />
                                  </div>
                                ) : (
                                  <span className='text-muted-foreground' />
                                )}
                              </td>
                              <td className='px-4 py-3 whitespace-nowrap font-semibold text-gray-700'>
                                {ligne.quantite}
                              </td>
                              <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
                                {ressource?.unite ? getUniteLabel(ressource.unite) : "—"}
                              </td>
                              <td className='px-4 py-3 w-[45%]'>
                                <Input
                                  placeholder='Observation (optionnelle)'
                                  value={observations[ligne._id] ?? ""}
                                  onChange={(e) =>
                                    setObservations((prev) => ({
                                      ...prev,
                                      [ligne._id]: e.target.value,
                                    }))
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className='border-b transition-colors hover:bg-muted/50'>
                          <td colSpan={4} className='p-2 py-10 text-center align-middle whitespace-nowrap text-brand-muted'>
                            Aucune ressource contrôlée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

              {demande.statutActuelDemande !== "controlee" && (
                <div className='rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                  Cette demande ne peut plus passer en bon de magasin (statut : {demande.statutActuelDemande}).
                </div>
              )}

              <div className='flex items-center justify-end gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate(`/employe/demande/view/${id}`)}
                >
                  Annuler
                </Button>
                <Button type='submit' variant='brand' disabled={!peutEtablir || isCreating}>
                  {isCreating ? <LoadingOutlined /> : <Warehouse className='size-4' />}
                  Établir le bon de magasin
                </Button>
              </div>
            </form>
        </>
      )}
    </div>
  );
};

export default BonMagasinCreatePage;