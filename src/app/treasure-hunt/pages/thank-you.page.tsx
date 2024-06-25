import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import LootBox from "@assets/images/treasure-hunt/loot-box.v3.png";
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
          borderRadius={8}
          bgcolor={theme.palette.secondary.main}
        >
          <Image src={LootBox} alt="Gift box opened." height="200" />
        </Box>
        <Typography variant="h3" fontWeight={600} textAlign="left" mt={4}>
          Congratulations!
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          You have claimed your gift successfully 🎉
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          You can view all the gift you have won in your account page by
          clicking the button bellow.
        </Typography>
        <Box py={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(`/account`)}
          >
            My account
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => router.push(`/treasure-hunt/map`)}
            sx={{ mt: 2 }}
          >
            Find more gifts !
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withTranslations("feedback")();
