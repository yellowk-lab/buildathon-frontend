"use client";

import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { withAuth } from "@app/auth";
import { BottomButton } from "@app/common/components";
import { useTranslations } from "next-intl";

export default function FeatureHomePage() {
  const router = useRouter();
  const t = useTranslations("home");

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={14} mb={16}>
        <Typography variant="h2" fontWeight={600} textAlign="left">
          {`ScanQuest`}
        </Typography>
        <Typography
          variant="h3"
          fontWeight={600}
          textAlign="left"
          mt={3}
          color="text.secondary"
        >
          {`How it works`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {t(`typographies.tuto_step_1`)}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {t(`typographies.tuto_step_2`)}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {t(`typographies.tuto_step_3`)}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {t(`typographies.tuto_step_4`)}
        </Typography>
        <Button
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => router.push(`/treasure-hunt/map`)}
        >
          {t(`buttons.view_map`)}
        </Button>
        <Typography
          variant="h3"
          fontWeight={600}
          textAlign="left"
          mt={3}
          color="text.secondary"
        >
          {`Try the demo`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Use the demo version of the map to locate hidden boxes, scan QR codes, and discover amazing (fictional) prizes.`}
        </Typography>
        <Button
          variant="contained"
          href="https://testnet.scanquest.xyz/treasure-hunt/demo"
          target="_blank"
          fullWidth
          sx={{ mt: 2 }}
        >
          Try the demo !
        </Button>
        <Typography
          variant="h3"
          fontWeight={600}
          textAlign="left"
          mt={3}
          color="text.secondary"
        >
          {`Create an event`}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Fill the form by clicking on the button bellow if you want to create a treasure hunt activation for your event.`}
        </Typography>
        <Button
          variant="outlined"
          href="https://bit.ly/scan-quest-event"
          target="_blank"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create an event
        </Button>
        <Button
          href="mailto:gm@scanquest.xyz"
          variant="text"
          fullWidth
          sx={{ mt: 4 }}
        >
          Need help?
        </Button>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
