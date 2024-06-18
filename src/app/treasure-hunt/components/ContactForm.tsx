import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import React from "react";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";

interface Props {
  winner: boolean;
  loading: boolean;
  onSubmit: (email: string) => void;
}
type PartcipationFormValue = {
  email: string;
  condition: string;
};

const WinningContactFormDisplay = () => (
  <>
    <Typography fontWeight="bold">Enter your email below</Typography>
    <Typography>
      {`To receive your gift and prevent it from being redrawn, please enter your
      email as soon as possible and click on "Receive my gift".`}
    </Typography>
  </>
);

const LosingContactFormDisplay = () => (
  <>
    <Typography fontWeight="bold">Sign up for the raffle</Typography>
    <Typography>
      {`To register for the raffle, please enter your email and click on "I'm
      feeling lucky!".`}
    </Typography>
  </>
);
const ContactForm: React.FC<Props> = ({ winner, onSubmit, loading }) => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    condition: Yup.string().required(
      "You must accept the terms and conditions"
    ),
  });

  const initialValuesForm: PartcipationFormValue = {
    email: "",
    condition: "",
  };

  const handleSubmit = async (values: PartcipationFormValue) => {
    onSubmit(values.email);
  };

  return (
    <Formik
      initialValues={initialValuesForm}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        touched,
        submitForm,
        isValid,
        dirty,
      }) => (
        <Form>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              {winner ? (
                <WinningContactFormDisplay />
              ) : (
                <LosingContactFormDisplay />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email"
                placeholder="Your best email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ mb: 2 }}
                error={touched.condition && Boolean(errors.condition)}
              >
                <RadioGroup
                  name="condition"
                  onChange={handleChange}
                  value={values.condition}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label={
                      <Typography>
                        I accept
                        <Link
                          href="/conditions"
                          target="_blank"
                          rel="noreferrer"
                          underline="none"
                        >
                          {" "}
                          the terms
                        </Link>
                      </Typography>
                    }
                  />
                </RadioGroup>
                {touched.condition && errors.condition && (
                  <FormHelperText>{errors.condition}</FormHelperText>
                )}
              </FormControl>
              <LoadingButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={submitForm}
                disabled={!isValid || !dirty}
                loading={loading}
              >
                {winner ? "Receive my gift" : "I'm feeling lucky"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
