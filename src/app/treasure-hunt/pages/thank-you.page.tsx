import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import Avatar from "@assets/images/thank-you.png";
import Image from "next/image";
import { grey } from "@mui/material/colors";

export default function ThankYouPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={16}>
        <Box
          display="flex"
          justifyContent="center"
          p={4}
          pb={0}
          borderRadius={8}
          bgcolor={theme.palette.secondary.main}
        >
          <Image src={Avatar} alt="Gift box opened." height="200" />
        </Box>
        <Typography variant="h3" fontWeight={600} textAlign="left" mt={4}>
          Thank You!
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          Your feedback means a lot to us.
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          Create your account to accumulate points with each review you provide,
          allowing you to order fabulous gifts.
        </Typography>
        <Box py={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(`/auth/signin`)}
          >
            Create an account
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => router.push(`/scan/articles`)}
            sx={{ mt: 2 }}
          >
            Scan other articles
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withTranslations("feedback")();
