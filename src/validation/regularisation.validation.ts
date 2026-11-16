import * as yup from "yup";
import { ObjectSchema } from "yup";
import { RegularisationFormInterface } from "@/interfaces/Reception";

export const RegularisationValidation: ObjectSchema<
  RegularisationFormInterface,
  any,
  any,
  any
> = yup.object({
  regulariserReception: yup.boolean().required(),
  lignes: yup
    .array()
    .of(
      yup.object({
        ligneId: yup.string().required(),
        selectionne: yup.boolean().required(),
        quantiteRegularisee: yup
          .number()
          .transform((value, original) => (original === "" ? undefined : value))
          .min(0, "La quantité ne peut pas être négative")
          .optional(),
      }),
    )
    .required(),
  motif: yup
    .string()
    .trim()
    .required("Le motif de régularisation est obligatoire")
    .min(5, "Le motif doit contenir au moins 5 caractères")
    .max(500, "Le motif ne doit pas dépasser 500 caractères"),
  commentaire: yup
    .string()
    .max(500, "Le commentaire ne doit pas dépasser 500 caractères")
    .optional(),
}).test(
  "au-moins-une-anomalie",
  "Sélectionnez au moins une anomalie à régulariser",
  (value) =>
    !!value?.regulariserReception || !!value?.lignes?.some((ligne) => ligne.selectionne),
);
