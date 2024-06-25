import {
  Alert,
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import EmptyLootBox from "@assets/images/treasure-hunt/loot-box-empty.png";
import Image from "next/image";
import { withAuth } from "@app/auth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_EVENT_STATUS_OF_LOOT_BOX,
  SCAN_LOOT_BOX,
} from "../gql/treasure-hunt.queries";
import { LootBox } from "../types/loot-box";
import { useGeolocation } from "react-use";
import React, { FC, useEffect, useState } from "react";
import {
  ASSIGN_LOCATION_TO_LOOT_BOX,
  CLAIM_LOOT_BOX,
} from "../gql/treasure-hunt.mutations";
import { grey } from "@mui/material/colors";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client, config, wallets } from "@core/thirdweb";
import { LoadingButton } from "@mui/lab";

export const useActiveAccountEmail = () => {
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // FIX: This breaks when the user logs out.
    setLoading(true);
    getUserEmail({ client: client })
      .then((email) => {
        setEmail(email);
        setLoading(false);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  }, []);
  return { email, loading };
};

export default function QRScanPage() {
  const router = useRouter();
  const theme = useTheme();
  const hash = router.query?.hash;
  const lootBoxId = Array.isArray(hash) ? hash[0] : hash;
  const state = useGeolocation();
  const { data: eventStatusData, loading: eventStatusLoading } = useQuery(
    GET_EVENT_STATUS_OF_LOOT_BOX,
    {
      variables: { lootBoxId: hash },
    }
  );
  const [
    scanLootBox,
    { data: scanResultData, error: scanError, loading: scanInProgress },
  ] = useLazyQuery(SCAN_LOOT_BOX);
  const [
    assignLocation,
    {
      data: assignmentResult,
      error: assignmentError,
      loading: assignmentLoading,
    },
  ] = useMutation(ASSIGN_LOCATION_TO_LOOT_BOX);
  const eventIsActive: boolean =
    eventStatusData?.lootbox?.event?.status === "ACTIVE";
  const lootBox: LootBox = scanResultData?.scanLootBox;
  const account = useActiveAccount();
  const emailAccount = useActiveAccountEmail();

  const lootIsClaimable = !lootBox?.lootClaimed && Boolean(lootBox?.loot.id);

  const [scanTriggered, setScanTriggered] = useState<boolean>(false);
  useEffect(() => {
    const eventStatus = eventStatusData?.lootbox?.event?.status;
    const stateIsReady = !state.loading && state.latitude && state.latitude;
    if (stateIsReady && !scanTriggered) {
      console.log("state ready");
      if (eventStatus === "ACTIVE") {
        console.log(eventStatus);
        console.log("scanLootBox");
        scanLootBox({
          variables: {
            input: {
              hash: lootBoxId,
              longitude: state.longitude!,
              latitude: state.latitude!,
            },
          },
        });
      } else {
        console.log("assignLocation");
        assignLocation({
          variables: {
            input: {
              hash: lootBoxId,
              longitude: state.longitude!,
              latitude: state.latitude!,
            },
          },
        });
      }
    }
  }, [eventStatusData, state, scanTriggered]);

  useEffect(() => {
    if (scanResultData || assignmentResult || scanError || assignmentError) {
      setScanTriggered(true);
    }
  }, [scanResultData, assignmentResult, scanError, assignmentError]);

  const [claimLoot, { data: claimResultData, loading: claimLoading }] =
    useMutation(CLAIM_LOOT_BOX);
  useEffect(() => {
    if (claimResultData) {
      console.log(claimResultData);
      const lootClaimed = claimResultData?.claimLootBox?.lootClaimed;
      if (lootClaimed) router.push(`/treasure-hunt/congratulations`);
    }
  }, [claimResultData]);

  const handleClaim = () => {
    if (account?.address) {
      claimLoot({
        variables: {
          input: {
            address: account?.address,
            email: emailAccount?.email,
            lootBoxId: lootBoxId,
          },
        },
      });
    } else {
      // TODO: Handle this properl
      throw new Error("User not connected.");
    }
  };

  return (
    <Container sx={{ px: 4 }}>
      <Box mt={20}>
        {eventIsActive ? (
          <Box>
            <Box>
              {scanInProgress ? (
                <>
                  <Skeleton height={400} />
                </>
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
                          connectButton={{
                            label: "Connect to claim !",
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <LootDisplay
                      title={`Try again.... There is no gift inside of this box!`}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h4"
              fontWeight={600}
              textAlign="center"
              color={grey[900]}
            >{`QR code activated 🚀`}</Typography>
            <Typography
              mt={2}
              fontWeight={600}
              textAlign="center"
              color={grey[700]}
            >{`This QR code has been pinned to your current location. If you wish to pin it to another location, move at the desired location and rescan the QR code. `}</Typography>
          </Box>
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
}

interface LootDisplayProps {
  imageUrl?: string;
  title: string;
}

export const LootDisplay: FC<LootDisplayProps> = ({ imageUrl, title }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        pb={4}
        borderRadius={8}
        bgcolor={theme.palette.secondary.main}
        mt={2}
      >
        <Image
          src={imageUrl ? imageUrl : EmptyLootBox}
          alt="Gift box."
          width="200"
          height="200"
        />
      </Box>
      <Typography
        mt={3}
        variant="h4"
        fontWeight={600}
        textAlign="center"
        color={grey[900]}
      >
        {title}
        {/* {scanError
          ? `Try again...`
          : lootBox?.lootClaimed
            ? `Too late... Someone already claimed this gift!`
            : `Try again... There is no gift inside of this box!`} */}
      </Typography>
    </Box>
  );
};

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
