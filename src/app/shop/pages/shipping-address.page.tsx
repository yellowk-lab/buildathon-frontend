import { Box, Container, TextField, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { BottomButton, CoinBalance } from "@app/common/components";
import { useSession } from "next-auth/react";
import { withAuth } from "@app/auth";
import { useRouter } from "next/router";
import { useCheckoutForm } from "../state";
import { CheckoutFormData } from "../types/checkout-form-data";
import { Form, Formik } from "formik";
import { checkoutValidationSchema } from "../utils/checkout-validation-schema";

export default function ShippingAddressPage() {
  const router = useRouter();
  const { formData, updateFormData } = useCheckoutForm();

  const handleSubmit = (values: CheckoutFormData) => {
    updateFormData(values);
    router.push("/shop/checkout");
  };

  return (
    <Container sx={{ px: 4 }} maxWidth="lg">
      <Box mt={16} mb={16}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Adresse de livraison
        </Typography>

        <Formik
          initialValues={formData}
          validationSchema={checkoutValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            submitForm,
            isValid,
            dirty,
            handleBlur,
            handleChange,
            values,
          }) => (
            <Form>
              <Typography variant="h5" fontWeight={700} mt={4}>
                Informations personnelles
              </Typography>
              <TextField
                name="firstName"
                value={values.firstName}
                label="Prénom"
                autoComplete="given-name"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ mt: 4 }}
              />
              <TextField
                name="lastName"
                label="Nom"
                autoComplete="family-name"
                value={values.lastName}
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ mt: 2 }}
              />

              <Typography variant="h5" fontWeight={700} mt={4}>
                Adresse
              </Typography>
              <TextField
                name="address"
                value={values.address}
                label="Adresse"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ mt: 4 }}
                autoComplete="street-address"
              />
              <TextField
                name="postalCode"
                label="Code postal"
                autoComplete="postal-code"
                value={values.postalCode}
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.postalCode && Boolean(errors.postalCode)}
                helperText={touched.postalCode && errors.postalCode}
                sx={{ mt: 2 }}
              />
              <TextField
                name="city"
                label="Ville"
                autoComplete="city"
                value={values.city}
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                sx={{ mt: 2 }}
              />
              <BottomButton
                variant="contained"
                onClick={submitForm}
                disabled={!isValid}
              >
                Suivant
              </BottomButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("account")());
