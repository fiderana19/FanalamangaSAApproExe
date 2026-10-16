import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageDemandeAchatFormInterface } from '@/interfaces/DemandeAchat'

export const DemandeAchatValidation: ObjectSchema<
    ManageDemandeAchatFormInterface,
    any,
    any,
    any
> = yup.object({
    approvisionnementId: yup
        .string()
        .required("L'identifiant de l'approvisionnement est requis !"),
    lignes: yup
        .array()
        .of(
            yup.object({
                ressourceId: yup.string().required("La ressource est requise !"),
                quantite: yup
                    .number()
                    .typeError("La quantité doit être un nombre !")
                    .required("La quantité est requise !")
                    .min(1, "La quantité doit être supérieure à zéro !"),
                inclure: yup.boolean().required(),
            })
        )
        .required("La demande doit contenir au moins une ligne !")
        .test(
            'au-moins-une-ligne',
            "Sélectionnez au moins une ressource à commander !",
            (lignes) => (lignes ?? []).some((ligne) => ligne?.inclure),
        ),
})
