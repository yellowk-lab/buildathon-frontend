import React from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { grey } from "@mui/material/colors";
import { withTranslations } from "@core/intl";
import withAuth from "../utils/with-auth";

export default function OtpPage() {
  const router = useRouter();
  const email = router.query.email;
  const articleId = router.query.articleId;
  const validationSchema = Yup.object({
    otp: Yup.number().required("Le code est requis"),
  });

  return (
    <Container sx={{ px: 4 }}>
      <Formik
        validateOnMount={true}
        initialValues={{
          otp: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          signIn("credentials", {
            email: email,
            token: values.otp,
            callbackUrl:
              articleId !== undefined
                ? `/feedback?articleId=${articleId}`
                : `/account`,
          });
        }}
      >
        {({
          values,
          touched,
          errors,
          isValid,
          dirty,
          handleBlur,
          handleChange,
          submitForm,
        }) => (
          <Form>
            <Box mt={30}>
              <Typography variant="h3" fontWeight={600} textAlign="left">
                Connectez-vous
              </Typography>
              <Typography mt={2} fontWeight={600} color={grey[700]}>
                Entrez le code à 6 chiffres envoyé à
              </Typography>
              <Typography fontWeight={600}>{email}</Typography>
              <TextField
                name="otp"
                placeholder="123456"
                fullWidth
                label="Code"
                value={values.otp}
                sx={{ mt: 4 }}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.otp && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 4 }}
                onClick={submitForm}
                disabled={!dirty || !isValid}
              >
                {`Vérifier le code`}
              </Button>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1 }}
                onClick={() => router.push("/auth/signin")}
              >
                {`Renvoyer le code`}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("auth")());
