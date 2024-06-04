import { Box, Button, Container, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { grey } from "@mui/material/colors";
import { BottomButton, CoinBalance } from "@app/common/components";
import { GET_ACCOUNT_DETAILS } from "../gql/account.queries";
import { useSession } from "next-auth/react";
import { withAuth } from "@app/auth";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [getAccountDetails, { data, loading }] = useLazyQuery(
    GET_ACCOUNT_DETAILS,
    {
      variables: { userId: session?.user?.id },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (session?.user?.id) {
      getAccountDetails({
        variables: {
          userId: session.user.id,
        },
      });
    }
  }, [session]);

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={16}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Votre compte
        </Typography>

        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Ci-dessous s'affiche le nombre total de points que vous avez gagnés. Vous pouvez les utiliser pour commander des cadeaux.`}
        </Typography>

        <CoinBalance
          amount={data?.getuserinfo?.pointsAvailable}
          label="votre solde"
          loading={loading}
          symbol="points"
        />
        <Button
          variant="outlined"
          onClick={() => router.push("/scan/articles")}
          fullWidth
        >
          {`Scanner d'autres articles`}
        </Button>
        <BottomButton variant="contained" onClick={() => router.push("/shop")}>
          Commander des cadeaux
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("account")());
