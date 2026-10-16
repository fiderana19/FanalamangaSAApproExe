import * as yup from 'yup'

export const ServiceValidation = yup.object({
    sigleService: yup.string().required("Le sigle est requis !"),
    nomService: yup.string().required("Le nom du service est requis !"),
    lieuService: yup.string().required("Le lieu du service est requis !"),
    direction: yup.string().required("La direction est requise !"),
})