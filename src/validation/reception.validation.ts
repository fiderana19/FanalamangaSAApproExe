import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageReceptionInterface } from '@/interfaces/Reception'

export const ReceptionValidation: ObjectSchema<
    ManageReceptionInterface,
    any,
    any,
    any
> = yup.object({
    livraisonId: yup.string().required("L'identifiant de la livraison est requis !"),
    lignesRecues: yup
        .array()
        .of(yup.string().required())
        .min(1, "Sélectionnez au moins une ressource reçue !")
        .required("Sélectionnez au moins une ressource reçue !"),
    estConforme: yup.boolean().required(),
    commentaireReception: yup
        .string()
        .max(500, "Le commentaire ne doit pas dépasser 500 caractères !")
        .optional(),
    commentaireLivraison: yup
        .string()
        .max(500, "Le commentaire ne doit pas dépasser 500 caractères !")
        .optional(),
    dateReception: yup.string().optional(),
})
