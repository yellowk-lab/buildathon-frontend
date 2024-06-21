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
import { useEffect } from "react";
import { ASSIGN_LOCATION_TO_LOOT_BOX } from "../gql/treasure-hunt.mutations";
import { grey } from "@mui/material/colors";

interface ScanLootBoxInput {
  hash: string;
  longitude: number;
  latitude: number;
}

export default function QRScanPage() {
  const router = useRouter();
  const hash = router.query?.hash;
  const state = useGeolocation();
  const theme = useTheme();
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

  useEffect(() => {
    if (!state?.loading && hash && eventStatusData) {
      const input: ScanLootBoxInput = {
        hash: Array.isArray(hash) ? hash[0] : hash,
        longitude: state.longitude!,
        latitude: state.latitude!,
      };
      if (eventIsActive) {
        console.log("event active, trigger scan");
        scanLootBox({
          variables: {
            input,
          },
        });
      } else {
        console.log("event NOT active, trigger assignment");
        assignLocation({
          variables: {
            input,
          },
        });
      }
    }
  }, [state, hash, eventStatusData]);

  const handleClaim = () => {
    // onClick if authenticated => direct claim without click
    // onClick if !authenticated => register, then claim automatically
    console.log(`Claiming loot ${lootBox.loot.id}`);
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
                  {lootBox?.lootClaimed || !lootBox?.loot ? (
                    <>
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
                          src={EmptyLootBox}
                          alt="Empty gift box."
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
                        {scanError
                          ? `Try again...`
                          : lootBox?.lootClaimed
                            ? `Too late... Someone already claimed this gift!`
                            : `Try again... There is no gift inside of this box!`}
                      </Typography>
                    </>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Image
                        src={lootBox?.loot?.imageUrl}
                        alt="Gift box opened."
                        width="200"
                        height="200"
                      />
                      <Typography
                        mt={4}
                        variant="h4"
                        fontWeight={600}
                        textAlign="center"
                        color={grey[900]}
                      >
                        {lootBox?.loot?.displayName}
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 4 }}
                        onClick={handleClaim}
                      >
                        Claim now!
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box>Not Active, Assignment result</Box>
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

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
