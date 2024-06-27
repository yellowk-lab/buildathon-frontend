import * as Yup from "yup";

export const checkoutValidationSchema = Yup.object().shape({
  email: Yup.string().email().required("Your email is required."),
  firstName: Yup.string().required("Your first name is required."),
  lastName: Yup.string().required("Your last name is required."),
  address: Yup.string(),
  country: Yup.string(),
  city: Yup.string(),
  postalCode: Yup.string(),
});
