import * as yup from 'yup'
import { UNITES } from '@/constants/RessourceUnite'

export const RessourceValidation = yup.object({
    reference: yup.string().required("La référence est requise !"),
    designationRessource: yup.string().required("La désignation est requise !"),
    ressourceDescription: yup.string().required("La description est requise !"),
    unite: yup.string().required("L'unité est requise !").oneOf(UNITES, "Unité invalide"),
    categorie: yup.string().required("La catégorie est requise !"),
})