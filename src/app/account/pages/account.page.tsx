import { Box, Container, Stack, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { grey } from "@mui/material/colors";
import { BottomButton } from "@app/common/components";
import { useRouter } from "next/router";
import { LootList } from "../components/LootList";
import { useLazyQuery } from "@apollo/client";
import { GET_LOOT_BOXES_BY_USER } from "../gql/account.queries";
import { useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import {
  accountAbstraction,
  chain,
  client,
  config,
  wallets,
} from "@core/thirdweb";
import Alert from "@mui/material/Alert";

export default function AccountPage() {
  const router = useRouter();
  const [getLootBoxes, { data: lootBoxesData, loading: lootBoxesLoading }] =
    useLazyQuery(GET_LOOT_BOXES_BY_USER);
  const account = useActiveAccount();

  useEffect(() => {
    if (account?.address) {
      getLootBoxes({
        variables: {
          emailOrWallet: account.address,
        },
        fetchPolicy: "cache-and-network",
      });
    }
  }, [account]);

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={16}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Your account
        </Typography>

        <Box mt={2}>
          <ConnectButton
            client={client}
            wallets={wallets}
            theme={config.theme}
            connectModal={config.connectModal}
            connectButton={{ label: "Connect to view your prizes" }}
            accountAbstraction={accountAbstraction}
          />
        </Box>

        <Typography mt={2} fontWeight={600} color={grey[700]}>
          {`Bellow you can view all the prizes you won in the different events. You can redeem those prizes anytime you want. `}
        </Typography>

        <Typography variant="h5" fontWeight={700} mt={4}>
          Redeem your gifts
        </Typography>

        <Stack sx={{ mt: 2 }}>
          <LootList
            lootBoxes={lootBoxesData?.lootBoxes ?? []}
            loading={lootBoxesLoading || !account?.address}
          />
        </Stack>

        <Alert
          sx={{ mt: 2 }}
          severity="info"
        >{`If you transfer or sell any of your items, you won't be able to redeem them in-app.`}</Alert>

        <BottomButton
          variant="contained"
          onClick={() => router.push("/treasure-hunt/map")}
        >
          Win more gifts !
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withTranslations("account")();
