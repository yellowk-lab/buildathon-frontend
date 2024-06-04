import * as Yup from "yup";

export const checkoutValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Votre prénom est requis"),
  lastName: Yup.string().required("Votre nom est requis"),
  address: Yup.string().required("Votre adresse est requise"),
  city: Yup.string().required("Votre ville est requise"),
  postalCode: Yup.number().required("Votre code postal est requis"),
});
