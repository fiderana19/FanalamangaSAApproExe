import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageApprovisionnementInterface } from '@/interfaces/Approvisionnement'

export const ApprovisionnementValidation: ObjectSchema<
    ManageApprovisionnementInterface,
    any,
    any,
    any
> = yup.object({
    bonMagasinId: yup.string().required("L'identifiant du bon de magasin est requis !"),
    commentaireApprovisionnement: yup
        .string()
        .max(500, "Le commentaire ne doit pas dépasser 500 caractères !")
        .optional(),
})
