import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import Image from "next/image";
import { grey } from "@mui/material/colors";
import { withAuth } from "@app/auth";
import { BottomButton } from "@app/common/components";
import StepOne from "@assets/images/gift-box-open.png";
import StepTwo from "@assets/images/gift-box-open.png";
import StepThree from "@assets/images/gift-box-open.png";
import StepFour from "@assets/images/gift-box-open.png";

export default function FeedbackHomePage() {
  const router = useRouter();

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={10} mb={16}>
        <Box display="flex" justifyContent="center" p={4}>
          <Image src={StepOne} alt="Etape 1" width="348" />
        </Box>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          {`C'est à vous de jouer !`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Donnez votre avis sur nos articles et accumulez des points échangeables contre des bons cadeaux de 20, 30 ou 50 CHF cumulables*. Suivez les instructions ci-dessous.`}
        </Typography>
        <Box display="flex" justifyContent="center" p={4}>
          <Image src={StepTwo} alt="Etape 1" width="348" />
        </Box>
        <Box display="flex" justifyContent="center" p={4}>
          <Image src={StepThree} alt="Etape 1" width="348" />
        </Box>
        <Box display="flex" justifyContent="center" p={4}>
          <Image src={StepFour} alt="Etape 1" width="348" />
        </Box>
        <BottomButton
          variant="contained"
          onClick={() => router.push(`/scan/articles`)}
        >
          {`Scanner un article`}
        </BottomButton>
        <Alert severity="info">{`*Valable dans la limite des stocks disponibles et jusqu’au 31 décembre 2024.`}</Alert>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("feedback")());
