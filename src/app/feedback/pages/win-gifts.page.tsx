import { Box, Button, Container, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import GiftBoxOpen from "@assets/images/gift-box-open.png";
import Image from "next/image";
import { grey } from "@mui/material/colors";
import { withAuth } from "@app/auth";

export default function WinGiftsPage() {
  const router = useRouter();
  const articleId = router.query?.articleId;

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={10}>
        <Box display="flex" justifyContent="center" p={4}>
          <Image src={GiftBoxOpen} alt="Gift box opened." width="150" />
        </Box>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Gagnez des cadeaux
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          Créez votre compte pour accumuler des points à chaque avis donné, vous
          pourrez ainsi de commander de superbes cadeaux.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => router.push(`/auth/signin?articleId=${articleId}`)}
        >
          Je veux gagner des points
        </Button>
        <Button
          fullWidth
          variant="outlined"
          disabled={!articleId}
          onClick={() => router.push(`/feedback?articleId=${articleId}`)}
          sx={{ mt: 2, mb: 8 }}
        >
          Je veux juste donner mon avis
        </Button>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("feedback")());
