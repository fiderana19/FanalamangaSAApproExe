import * as yup from 'yup'

export const ChangeMyPasswordValidation = yup.object({
    ancienMotDePasse: yup.string().required("L'ancien mot de passe est requis !"),
    nouveauMotDePasse: yup.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères !").required("Le nouveau mot de passe est requis !"),
    confirmationMotDePasse: yup.string().oneOf([yup.ref("nouveauMotDePasse")], "Les mots de passe ne correspondent pas !").required("La confirmation du mot de passe est requise !")
})