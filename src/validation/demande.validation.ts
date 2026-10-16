import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import {
    ControlerDemandeInterface,
    ManageDemandeInterface,
    ManageLigneDemandeInterface,
    TraiterDemandeInterface
} from '@/interfaces/Demande'

export const DemandeValidation: ObjectSchema<
    ManageDemandeInterface,
    any,
    any,
    any
> = yup.object({
    motif: yup.string().required("Le motif est requis !"),
    urgence: yup.boolean().required("L'urgence est requise !"),
})

export const LigneValidation: ObjectSchema<
    ManageLigneDemandeInterface,
    any,
    any,
    any
> = yup.object({
    ressource: yup.string().required("La ressource est requise !"),
    quantite: yup
        .number()
        .typeError("La quantité doit être un nombre !")
        .min(1, "La quantité doit être au moins 1 !")
        .required("La quantité est requise !"),
})

export const TraiterDemandeValidation: ObjectSchema<
    TraiterDemandeInterface,
    any,
    any,
    any
> = yup.object({
    commentaireTraitementDemande: yup
        .string()
        .max(500, "Le commentaire ne doit pas dépasser 500 caractères !")
        .optional(),
    lignesValidees: yup
        .array()
        .of(yup.string().defined())
        .min(1, "Sélectionnez au moins une ressource à valider !")
        .optional(),
})

export const ControlerDemandeValidation: ObjectSchema<
    ControlerDemandeInterface,
    any,
    any,
    any
> = yup.object({
    lignesConformes: yup
        .array()
        .of(yup.string().defined())
        .optional(),
    commentaireControle: yup
        .string()
        .max(500, "Le commentaire ne doit pas dépasser 500 caractères !")
        .optional(),
})
