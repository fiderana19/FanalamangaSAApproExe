import * as yup from 'yup'

export const LoginValidation = yup.object({
    email: yup.string().email("Adresse email invalide !").required("L'adresse email est requise !"),
    motdepasse: yup.string().required("Mot de passe requis !")
})