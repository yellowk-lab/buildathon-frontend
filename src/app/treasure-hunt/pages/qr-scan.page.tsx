import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { grey } from "@mui/material/colors";
import { withTranslations } from "@core/intl";
import { withAuth } from "@app/auth";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { client, config, wallets } from "@core/thirdweb";
import { LoadingButton } from "@mui/lab";
import {
  GET_EVENT_STATUS_OF_LOOT_BOX,
  SCAN_LOOT_BOX,
} from "../gql/treasure-hunt.queries";
import { LootBox } from "../types/loot-box";
import {
  ASSIGN_LOCATION_TO_LOOT_BOX,
  CLAIM_LOOT_BOX,
} from "../gql/treasure-hunt.mutations";
import { useActiveAccountEmail } from "@core/thirdweb/hooks";
import { LootDisplay } from "../components/LootDisplay";
import useGeolocation from "../hooks/use-geolocation";

const QRScanPage: FC = () => {
  const router = useRouter();
  const hash = router.query?.hash;
  const lootBoxId = Array.isArray(hash) ? hash[0] : hash;
  const { location, error } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });
  const { data: eventStatusData, loading: eventStatusLoading } = useQuery(
    GET_EVENT_STATUS_OF_LOOT_BOX,
    { variables: { lootBoxId: hash } }
  );
  const [
    scanLootBox,
    { data: scanResultData, error: scanError, loading: scanInProgress },
  ] = useLazyQuery(SCAN_LOOT_BOX);
  const [assignLocation, { data: assignmentResult, error: assignmentError }] =
    useMutation(ASSIGN_LOCATION_TO_LOOT_BOX);
  const [claimLoot, { data: claimResultData, loading: claimLoading }] =
    useMutation(CLAIM_LOOT_BOX);
  const account = useActiveAccount();
  const emailAccount = useActiveAccountEmail(client);
  const [scanTriggered, setScanTriggered] = useState<boolean>(false);
  const eventIsActive = eventStatusData?.lootbox?.event?.status === "ACTIVE";
  const lootBox: LootBox = scanResultData?.scanLootBox;
  const lootIsClaimable = !lootBox?.lootClaimed && Boolean(lootBox?.loot.id);

  useEffect(() => {
    if (!!location && !scanTriggered && !!lootBoxId) {
      if (eventIsActive) {
        scanLootBox({
          variables: {
            input: {
              hash: lootBoxId,
              longitude: location.longitude,
              latitude: location.latitude,
            },
          },
        }).catch((error) => console.log(error));
      } else {
        assignLocation({
          variables: {
            input: {
              hash: lootBoxId,
              longitude: location.longitude,
              latitude: location.latitude,
            },
          },
        }).catch((error) => console.log(error));
      }
    }
  }, [eventIsActive, scanTriggered, location, lootBoxId]);

  useEffect(() => {
    if (scanResultData || assignmentResult || scanError || assignmentError) {
      setScanTriggered(true);
    }
  }, [scanResultData, assignmentResult, scanError, assignmentError]);

  useEffect(() => {
    if (claimResultData?.claimLootBox?.lootClaimed) {
      router.push(`/treasure-hunt/congratulations`);
    }
  }, [claimResultData]);

  const handleClaim = () => {
    if (account?.address) {
      claimLoot({
        variables: {
          input: {
            address: account.address,
            email: emailAccount.email,
            lootBoxId,
          },
        },
      });
    } else {
      throw new Error("User not connected.");
    }
  };

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={20}>
        {eventIsActive ? (
          <Box>
            {scanInProgress ? (
              <Skeleton height={400} />
            ) : (
              <Box>
                {scanError && (
                  <Alert severity="warning">{`It seems you're not at the same location or not close enough to the QR you've scanned.`}</Alert>
                )}
                {lootIsClaimable ? (
                  <Box>
                    <LootDisplay
                      imageUrl={lootBox?.loot.imageUrl}
                      title={lootBox?.loot.name}
                    />
                    {account?.address ? (
                      <LoadingButton
                        fullWidth
                        variant="contained"
                        sx={{ mt: 4 }}
                        onClick={handleClaim}
                        loading={claimLoading}
                        disabled={!!claimResultData}
                      >
                        Claim now!
                      </LoadingButton>
                    ) : (
                      <ConnectButton
                        client={client}
                        wallets={wallets}
                        theme={config.theme}
                        connectModal={config.connectModal}
                        connectButton={{ label: "Connect to claim !" }}
                      />
                    )}
                  </Box>
                ) : (
                  <LootDisplay
                    imageUrl={lootBox?.loot?.imageUrl ?? undefined}
                    title={
                      lootBox?.loot?.id
                        ? `Too late... Someone else already claimed this gift!`
                        : `Try again.... There is no gift inside of this box!`
                    }
                  />
                )}
              </Box>
            )}
          </Box>
        ) : assignmentResult?.assignLocationToLootBox?.location?.id ? (
          <Box textAlign="center">
            <Typography
              variant="h4"
              fontWeight={600}
              color={grey[900]}
            >{`QR code activated 🚀`}</Typography>
            <Typography
              mt={2}
              fontWeight={600}
              color={grey[700]}
            >{`This QR code has been pinned to your current location. If you wish to pin it to another location, move at the desired location and rescan the QR code.`}</Typography>
          </Box>
        ) : assignmentError ? (
          <Alert severity="error">{assignmentError.message}</Alert>
        ) : (
          <Alert severity="info">Loading...</Alert>
        )}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => router.push(`/treasure-hunt/map`)}
          sx={{ mt: 4, mb: 8 }}
        >
          Find other gifts
        </Button>
      </Box>
    </Container>
  );
};

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());

export default QRScanPage;
