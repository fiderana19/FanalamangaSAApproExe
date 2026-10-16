import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageBonSortieInterface, ApurementType } from '@/interfaces/BonSortie'

export const BonSortieValidation: ObjectSchema<
    ManageBonSortieInterface,
    any,
    any,
    any
> = yup.object({
    approvisionnementId: yup.string().required("L'identifiant de l'approvisionnement est requis !"),
    dateSortie: yup
        .string()
        .optional(),
    apurement: yup
        .string()
        .oneOf(['total', 'partiel'] as ApurementType[], "Le type d'apurement est invalide !")
        .optional(),
    lignes: yup
        .array()
        .of(
            yup.object({
                ligneBonMagasinId: yup.string().required("L'identifiant de la ligne du bon de magasin est requis !"),
                quantiteLigneSortie: yup
                    .number()
                    .typeError("La quantité doit être un nombre !")
                    .required("La quantité est requise !")
                    .min(1, "La quantité doit être supérieure à zéro !"),
                observation: yup
                    .string()
                    .max(500, "L'observation ne doit pas dépasser 500 caractères !")
                    .optional(),
            })
        )
        .required("La sortie doit contenir au moins une ligne !")
        .min(1, "La sortie doit contenir au moins une ligne !"),
})