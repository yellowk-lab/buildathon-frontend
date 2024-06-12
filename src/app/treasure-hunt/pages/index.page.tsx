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

export default function FeatureHomePage() {
  const router = useRouter();

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={10}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          {`ScanQuest`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`1. Look at the map to locate the boxes.`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`2. Find a QR code and scan it!`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`3. Discover if you've won a prize.`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`4. Redeem your prize and receive the physical item at home`}
        </Typography>
        <Alert
          severity="info"
          sx={{ mt: 4 }}
        >{`Valid while supplies last and until June 30, 2024.`}</Alert>
        <BottomButton variant="contained" onClick={() => router.push(`/map`)}>
          {`View the map !`}
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
