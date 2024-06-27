"use client";

import { Alert, Box, Container, Typography } from "@mui/material";
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
      <Box mt={14}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          {`ScanQuest`}
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
        <Alert severity="info" sx={{ mt: 4 }}>
          {t(`alerts.game_validity`)}
        </Alert>
        <BottomButton
          variant="contained"
          onClick={() => router.push(`/treasure-hunt/map`)}
        >
          {t(`buttons.view_map`)}
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
