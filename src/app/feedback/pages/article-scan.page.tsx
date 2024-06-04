import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  SwipeableDrawer,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { withTranslations } from "@core/intl";
import { useEffect, useRef, useState } from "react";
import CameraFeed from "../components/CameraFeed";
import { SEARCH_ARTICLES_BY_TITLE } from "../gql/feedback.queries";
import { preprocessImageFromURL, useTextRecognition } from "@core/ocr";
import { useLazyQuery } from "@apollo/client";
import { Article } from "../types/article";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import Carousel from "react-material-ui-carousel";
import { usePermission } from "react-use";

const Grabber = styled("div")(({ theme }) => ({
  width: 36,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function ArticleScan() {
  const router = useRouter();
  const theme = useTheme();
  const [
    recognizeText,
    {
      data: recognitionData,
      loading: recognitionInProgress,
      error: recognitionError,
    },
  ] = useTextRecognition();
  const [
    searchArticles,
    { data: articlesData, loading: searchInProgress, error: searchError },
  ] = useLazyQuery(SEARCH_ARTICLES_BY_TITLE);
  const cameraFeedRef = useRef<{ captureImage: () => void }>(null);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState(
    `Ciblez le titre d'un article et cliquez ensuite sur "Scanner".`
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [error, setError] = useState<any>(null);
  const cameraPermission = usePermission({ name: "camera" });

  const triggerCapture = () => {
    handleReset();
    cameraFeedRef.current?.captureImage();
  };

  const handleReset = () => {
    setSelectedArticle(null);
    setArticles([]);
    setError(null);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (recognitionData) {
      searchArticles({ variables: { title: recognitionData } });
    }
  }, [recognitionData]);

  useEffect(() => {
    if (recognitionError) {
      setError(recognitionError);
    }
    if (
      searchError ||
      (articlesData && articles.length === 0 && !recognitionError)
    ) {
      setError(Error("Aucun article ne correspond, veuillez réssayer."));
    }
  }, [searchError, articlesData, recognitionError]);

  useEffect(() => {
    if (articlesData) {
      const marshalledArticles: Article[] =
        articlesData?.getArticlesByTitle?.edges?.map(
          (edge: any) => edge.node
        ) || [];
      if (Array.isArray(marshalledArticles)) {
        setArticles(marshalledArticles);
        setSelectedArticle(marshalledArticles[0]);
      }
    }
  }, [articlesData]);

  const handleCapture = async (imageUrl: string) => {
    await preprocessImageFromURL(imageUrl)
      .then(async (image: string) => {
        recognizeText(image);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Container>
      <Box mt={20}>
        <CameraFeed
          onCapture={(imageUrl) => handleCapture(imageUrl)}
          ref={cameraFeedRef}
        />
      </Box>

      <SwipeableDrawer
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        anchor="bottom"
        variant="persistent"
        PaperProps={{
          sx: {
            backgroundColor: "white",
            border: "none",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Grabber />
        <Box p={4} py={6}>
          {articles.length > 0 ? (
            <Box>
              <Box key={articles[0]?.id}>
                <Typography
                  textAlign="center"
                  mt={2}
                  color="#C4C4C4"
                  fontWeight={600}
                >
                  {`Que pensez vous de l'article`}
                </Typography>
                {articles.length > 1 ? (
                  <Carousel
                    autoPlay={false}
                    animation="slide"
                    navButtonsAlwaysInvisible
                    navButtonsProps={{
                      style: {
                        backgroundColor: "transparent",
                        color: theme.palette.primary.main,
                      },
                    }}
                    activeIndicatorIconButtonProps={{
                      style: {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.primary.main,
                      },
                    }}
                    indicatorContainerProps={{
                      style: {
                        marginTop: 26,
                      },
                    }}
                    onChange={(now?: number) => {
                      setSelectedArticle(articles[now || 0]);
                    }}
                  >
                    {articles.map((article: Article) => (
                      <Box px={6} key={article.id}>
                        <Typography
                          variant="h4"
                          textAlign="center"
                          mt={1}
                          fontWeight={600}
                        >
                          {article.title}
                        </Typography>
                      </Box>
                    ))}
                  </Carousel>
                ) : (
                  <Typography
                    variant="h4"
                    textAlign="center"
                    mt={1}
                    fontWeight={600}
                  >
                    {articles[0]?.title}
                  </Typography>
                )}

                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 4 }}
                    disabled={!selectedArticle}
                    onClick={() =>
                      router.push(
                        `/feedback/win-gifts?articleId=${selectedArticle?.id}`
                      )
                    }
                  >
                    Je donne mon avis
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleReset}
                    sx={{ mt: 1 }}
                  >
                    Scanner à nouveau
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : recognitionInProgress || searchInProgress ? (
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <CircularProgress size={64} sx={{ m: 2 }} thickness={1.75} />
              <Typography variant="h6" textAlign="center">
                {recognitionInProgress
                  ? "Analyse de l'image en cours..."
                  : searchInProgress
                    ? "Comparaison avec les articles existants..."
                    : null}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" textAlign="center" mt={1}>
                {message}
              </Typography>
              {error && (
                <Alert sx={{ mt: 2 }} severity="warning">
                  {error.message}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={triggerCapture}
                disabled={searchInProgress || recognitionInProgress}
              >
                Scanner
              </Button>
            </Box>
          )}
        </Box>
      </SwipeableDrawer>
    </Container>
  );
}

export const getServerSideProps = withTranslations("feedback")();
