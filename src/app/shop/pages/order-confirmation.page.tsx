import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import MainAvatar from "@assets/images/shop/airdrop-box.png";
import Image from "next/image";
import { grey } from "@mui/material/colors";

export default function ThankYouPage() {
  const router = useRouter();
  const theme = useTheme();
  const orderNumber = router.query.orderNumber;

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
          <Image src={MainAvatar} alt="Gift box opened." height="240" />
        </Box>
        <Typography variant="h3" fontWeight={600} textAlign="left" mt={4}>
          Thank you !
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Your order #${orderNumber
            ?.toString()
            .padStart(4, "0")} has been registered.`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          You will soon receive a confirmation email with the details of your
          order.
        </Typography>
        <Box py={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(`/account`)}
          >
            {`Redeem your other items`}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => router.push(`/treasure-hunt/map`)}
            sx={{ mt: 2 }}
          >
            {`Win more gifts !`}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withTranslations("shop")();
