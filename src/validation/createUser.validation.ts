import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { CreateUserInterface } from '@/interfaces/User'

export const CreateUserValidation: ObjectSchema<
    CreateUserInterface,
    any,
    any,
    any
> = yup.object({
    nom: yup.string().required("Le nom est requis !"),
    prenom: yup.string().optional(),
    email: yup.string().email("L'adresse email est invalide !").required("L'adresse email est requise !"),
    telephone: yup.string().matches(/^\d{9}$/, "Le téléphone doit contenir exactement 9 chiffres !").required("Le téléphone est requis !"),
    motdepasse: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères !").required("Le mot de passe est requis !"),
    estActive: yup.boolean().required("Le statut est requis !"),
    role: yup.string().required("Le rôle est requis !"),
    service: yup.string().nullable().optional(),
    responsabilite: yup.string().nullable().optional(),
})