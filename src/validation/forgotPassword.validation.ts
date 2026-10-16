import * as yup from 'yup'

export const ForgotPasswordValidation = yup.object({
    email: yup.string().email("Adresse email invalide !").required("L'adresse email est requise !")
})