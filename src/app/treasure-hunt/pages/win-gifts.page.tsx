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
          Win Gifts
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          Create your account to accumulate points with each review you provide,
          allowing you to order fabulous gifts.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => router.push(`/auth/signin?articleId=${articleId}`)}
        >
          I want to earn points
        </Button>
        <Button
          fullWidth
          variant="outlined"
          disabled={!articleId}
          onClick={() => router.push(`/feedback?articleId=${articleId}`)}
          sx={{ mt: 2, mb: 8 }}
        >
          I just want to give feedback
        </Button>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("feedback")());
