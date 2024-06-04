import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { withTranslations } from "@core/intl";
import { grey } from "@mui/material/colors";
import { withAuth } from "@app/auth";
import { useRouter } from "next/router";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { GET_EARNED_POINTS } from "../gql/feedback.queries";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import cashInSfx from "@assets/sounds/cha-ching.mp3";
import { CoinBalance } from "@app/common/components";
import Avatar from "@assets/images/winning.png";
import Image from "next/image";

export default function AccountPage() {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();
  const [waiting, setWaiting] = useState(true);
  const [play] = useSound(cashInSfx);
  const [getEarnedPoints, { data, loading, error }] = useLazyQuery(
    GET_EARNED_POINTS,
    {
      variables: {
        userId: session?.user?.id,
        articleId: router.query?.articleId,
      },
    }
  );

  useEffect(() => {
    setTimeout(() => {
      getEarnedPoints();
      setWaiting(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (data) play();
  }, [data]);

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
          {"Félicitations !"}{" "}
        </Typography>
        <Typography mt={2} fontWeight={600} color={grey[700]}>
          Grâce à votre avis vous venez de gagner des points échangables contre
          de superbes cadeaux.
        </Typography>

        <CoinBalance
          amount={data?.getearnedpoints}
          loading={loading || waiting}
          label="points gagnés !"
          symbol="points"
        />
        <Box py={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(`/account`)}
          >
            Consulter mon compte
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => router.push(`/scan/articles`)}
            sx={{ mt: 2 }}
          >
            {`Scanner d'autres articles`}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("account")());
