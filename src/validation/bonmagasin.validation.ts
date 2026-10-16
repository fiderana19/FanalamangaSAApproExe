import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageBonMagasinInterface } from '@/interfaces/BonMagasin'

export const BonMagasinValidation: ObjectSchema<
    ManageBonMagasinInterface,
    any,
    any,
    any
> = yup.object({
    demandeId: yup.string().required("L'identifiant de la demande est requis !"),
    objet: yup
        .string()
        .max(500, "L'objet ne doit pas dépasser 500 caractères !")
        .optional(),
    dateBonMagasin: yup
        .string()
        .optional(),
    lignesObservations: yup
        .array()
        .of(
            yup.object({
                ligneDemandeId: yup.string().required("L'identifiant de la ligne de demande est requis !"),
                observation: yup
                    .string()
                    .max(500, "L'observation ne doit pas dépasser 500 caractères !")
                    .optional(),
            })
        )
        .optional(),
})