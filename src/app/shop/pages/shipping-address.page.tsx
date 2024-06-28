import { Box, Container, TextField, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { BottomButton } from "@app/common/components";
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
          Shipping address
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
            handleBlur,
            handleChange,
            values,
          }) => (
            <Form>
              <Typography variant="h5" fontWeight={700} mt={4}>
                Personal information
              </Typography>
              <TextField
                name="firstName"
                value={values.firstName}
                label="First name"
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
                label="Last name"
                autoComplete="family-name"
                value={values.lastName}
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ mt: 2 }}
              />
              <TextField
                name="email"
                value={values.email}
                label="Email"
                autoComplete="email"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mt: 4 }}
              />

              <BottomButton
                variant="contained"
                onClick={submitForm}
                disabled={!isValid}
              >
                Next
              </BottomButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("account")());
