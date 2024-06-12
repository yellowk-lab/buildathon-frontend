import {
  Alert,
  Box,
  Button,
  Container,
  Rating,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ARTICLE_BY_ID } from "../gql/treasure-hunt.queries";
import { Article } from "../types/article";
import { CREATE_REVIEW } from "../gql/treasure-hunt.mutations";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { StarRounded } from "@mui/icons-material";
import { useSession } from "next-auth/react";

const MAX_REVIEW_LENGTH = 750;
const MIN_REVIEW_LENGTH = 0;

export default function FeedbackFormPage() {
  const { data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();
  const articleId = router.query?.articleId;
  const [article, setArticle] = useState<Article>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data, loading } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { id: articleId },
  });
  const [
    createReview,
    { data: reviewData, loading: reviewLoading, error: reviewError },
  ] = useMutation(CREATE_REVIEW);

  useEffect(() => {
    if (data && data?.articlesCollection) {
      setArticle(data.articlesCollection?.edges[0]?.node);
    }
  }, [data]);

  useEffect(() => {
    if (reviewData) {
      if (session) {
        router.push(`/feedback/points-earned?articleId=${articleId}`);
      } else {
        router.push("/feedback/thank-you");
      }
    }
  }, [reviewData]);

  useEffect(() => {
    if (reviewError) {
      if (reviewError.message.startsWith("duplicate")) {
        setErrorMessage(
          `Vous ne pouvez pas donner votre avis plusieurs fois sur le même article.`
        );
      } else {
        setErrorMessage(`Oups! Une erreur c'est produite, veuillez réessayer`);
      }
    }
  }, [reviewError]);

  const validationSchema = Yup.object({
    ratingInterest: Yup.number()
      .required("La note est obligatoire")
      .min(1, "La note doit être au minium 1")
      .max(5, "La note doit être au maximum 5"),
    ratingClearPleasant: Yup.number()
      .required("La note est obligatoire")
      .min(1, "La note doit être au minium 1")
      .max(5, "La note doit être au maximum 5"),
    ratingInformative: Yup.number()
      .required("La note est obligatoire")
      .min(1, "La note doit être au minium 1")
      .max(5, "La note doit être au maximum 5"),
    review: Yup.string()
      .min(
        MIN_REVIEW_LENGTH,
        `Le commentaire doit avoir au moins ${MIN_REVIEW_LENGTH} caractères.`
      )
      .max(
        MAX_REVIEW_LENGTH,
        `Le commentaire doit avoir au maximum ${MAX_REVIEW_LENGTH} caractères.`
      ),
  });

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={16}>
        <Typography textAlign="center" mt={2} color="#C4C4C4" fontWeight={600}>
          {`Que pensez vous de l'article`}
        </Typography>
        <Typography variant="h4" textAlign="center" mt={1} fontWeight={600}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width="100%" />
              <Skeleton variant="rectangular" width="80%" sx={{ mt: 1 }} />
            </>
          ) : (
            article?.title
          )}
        </Typography>
      </Box>
      <Formik
        validateOnMount={true}
        initialValues={{
          ratingInterest: 0,
          ratingClearPleasant: 0,
          ratingInformative: 0,
          review: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await createReview({
              variables: {
                input: {
                  userid: session?.user?.id,
                  articleId: articleId,
                  ratingInterest: parseInt(values.ratingInterest.toString()),
                  ratingClearPleasant: parseInt(
                    values.ratingClearPleasant.toString()
                  ),
                  ratingInformative: parseInt(
                    values.ratingInformative.toString()
                  ),
                  content: values.review,
                },
              },
            });
          } catch (e) {
            console.error(e);
          }
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
            <Box
              mt={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Typography
                variant="h6"
                fontWeight={700}
                paragraph
              >{`Le sujet vous a intéressé :`}</Typography>
              <Rating
                name="ratingInterest"
                size="large"
                value={values.ratingInterest}
                onChange={handleChange}
                icon={<StarRounded fontSize="large" color="primary" />}
                emptyIcon={<StarRounded fontSize="large" color="disabled" />}
              />
            </Box>
            <Box
              mt={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Typography
                variant="h6"
                fontWeight={700}
                paragraph
              >{`L'article est plaisant à lire :`}</Typography>
              <Rating
                name="ratingClearPleasant"
                size="large"
                value={values.ratingClearPleasant}
                onChange={handleChange}
                icon={<StarRounded fontSize="large" color="primary" />}
                emptyIcon={<StarRounded fontSize="large" color="disabled" />}
              />
            </Box>
            <Box
              mt={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Typography
                variant="h6"
                fontWeight={700}
                paragraph
              >{`L'article est suffisamment instructif :`}</Typography>
              <Rating
                name="ratingInformative"
                size="large"
                value={values.ratingInformative}
                onChange={handleChange}
                icon={<StarRounded fontSize="large" color="primary" />}
                emptyIcon={<StarRounded fontSize="large" color="disabled" />}
              />
            </Box>
            <Box mt={8}>
              <Typography
                variant="h6"
                fontWeight={700}
              >{`Des suggestions d'améliorations ?`}</Typography>
              <TextField
                name="review"
                multiline
                rows={8}
                placeholder="Partagez votre avis ! Plus votre commentaire est pertinent, original, clair, engageant et impactant, plus vous accumulerez de points."
                fullWidth
                value={values.review}
                sx={{ mt: 1 }}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.review && Boolean(errors.review)}
                helperText={touched.review && errors.review}
              />
              <Typography
                variant="subtitle1"
                textAlign="right"
                width="100%"
                color={
                  values.review.length <= MAX_REVIEW_LENGTH
                    ? "#C4C4C4"
                    : theme.palette.error.main
                }
                fontWeight={600}
              >{`${values.review.length} / ${MAX_REVIEW_LENGTH}`}</Typography>
            </Box>
            <Box py={4}>
              {errorMessage && (
                <Alert variant="filled" severity="error" sx={{ mt: 2, mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <LoadingButton
                fullWidth
                variant="contained"
                onClick={submitForm}
                loading={reviewLoading}
                disabled={!dirty || !isValid || reviewData || reviewError}
              >
                Envoyer mon avis
              </LoadingButton>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => router.push("/scan/articles")}
              >
                Annuler
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export const getServerSideProps = withTranslations("feedback")();
