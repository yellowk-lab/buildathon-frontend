import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { AuthError } from "@supabase/supabase-js";
import { withTranslations } from "@core/intl";
import withAuth from "../utils/with-auth";
import { supabase } from "@core/supabase";

export default function LoginPage() {
  const [error, setError] = useState<AuthError>();
  const router = useRouter();
  const articleId = router.query.articleId;
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Votre email n'est pas valide")
      .required("Votre email est requis"),
    conditions: Yup.string().required(
      "Vous devez accepter les conditions de participation"
    ),
  });

  const displayErrorMessageFor = (status: number | undefined) => {
    switch (status) {
      case 429:
        return "Veuillez patienter un moment avant de réessayer.";
      case 500:
        return "Oups! Nous avons rencontré un problème, veuillez réessayer. ";
      default:
        return "Une erreur c'est porduite, veuillez réessayer.";
    }
  };

  const handleLogin = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setError(error);
      } else {
        if (Boolean(articleId)) {
          router.push(`/auth/otp?email=${email}&articleId=${articleId}`);
        } else {
          router.push(`/auth/otp?email=${email}`);
        }
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <Container sx={{ px: 4 }}>
      <Formik
        validateOnMount={true}
        initialValues={{
          email: "",
          conditions: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleLogin(values.email);
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
                Renseignez votre email ci-dessous afin de recevoir un code
                unique pour vous connecter ou vous inscrire.
              </Typography>
              <TextField
                name="email"
                placeholder="Votre meilleure email"
                fullWidth
                label="Email"
                value={values.email}
                sx={{ mt: 4 }}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <FormControl
                sx={{ mt: 1 }}
                error={touched.conditions && Boolean(errors.conditions)}
              >
                <RadioGroup
                  name="conditions"
                  onChange={handleChange}
                  value={values.conditions}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label={
                      <Typography>
                        J&apos;accepte
                        <Link
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                          underline="none"
                        >
                          {" "}
                          les conditions
                        </Link>
                      </Typography>
                    }
                  />
                </RadioGroup>
                {touched.conditions && errors.conditions && (
                  <FormHelperText>{errors.conditions}</FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 4 }}
                onClick={submitForm}
                disabled={!dirty || !isValid}
              >
                Recevoir mon code
              </Button>
              {error && (
                <>
                  <Alert variant="filled" severity="error" sx={{ mt: 2 }}>
                    {displayErrorMessageFor(error.status)}
                  </Alert>
                </>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("auth")());
