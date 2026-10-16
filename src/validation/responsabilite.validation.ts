import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { ManageResponsabiliteInterface } from '@/interfaces/Responsabilite'

export const ResponsabiliteValidation: ObjectSchema<
  ManageResponsabiliteInterface,
  any,
  any,
  any
> = yup.object({
    libelle: yup.string().required("Le libellé est requis !"),
    descriptionResponsabilite: yup.string().optional(),
})