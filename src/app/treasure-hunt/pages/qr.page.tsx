import Logo from "@app/treasure-hunt/components/Logo";
import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SCAN_LOOT_BOX_QR } from "@app/treasure-hunt/gql/mutation";
import { LoadingButton } from "@mui/lab";
import { NearMeRounded } from "@mui/icons-material";
import Countdown from "react-countdown";
import moment from "moment";
import { GET_UPCOMING_EVENT } from "@app/treasure-hunt/gql/query";
import { BottomButton } from "@app/common/components";

interface CountdownCellProps {
  label: string;
  value: string | number;
  noPad?: boolean;
}

const CountdownCell = ({ label, value, noPad }: CountdownCellProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      p={2}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography fontWeight={600} fontSize={64} color="white">
        {value.toString().padStart(noPad ? 1 : 2, "0")}
      </Typography>
      <Typography fontFamily="Cookie" color="white" fontSize={24} mt={-2}>
        {label}
      </Typography>
    </Box>
  );
};

enum SCAN_ERROR {
  SCAN_OUTSIDE_EVENT_ERROR,
  QR_CODE_NOT_FOUND,
  UNKNOWN_SCAN_ERROR,
}

export const ErrorText = ({ error }: { error: SCAN_ERROR | null }) => {
  switch (error) {
    case SCAN_ERROR.QR_CODE_NOT_FOUND:
      return (
        <Box p={4}>
          <Grid item xs={12}>
            <Logo />
          </Grid>
          <Typography sx={{ mt: 4 }} textAlign="justify">
            The QR code you scanned is invalid or does not exist. Try again or
            find another box.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            href="/treasure-hunt/map"
          >
            Find another box
          </Button>
        </Box>
      );
    case SCAN_ERROR.SCAN_OUTSIDE_EVENT_ERROR:
      return <NoOutgoingEvent />;
    default:
      return (
        <Box>
          <Grid item xs={12}>
            <Logo />
          </Grid>
          <Typography>An error has occurred, please try again.</Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            href="/treasure-hunt/map"
          >
            Find another box
          </Button>
        </Box>
      );
  }
};

export default function ScanResultPage() {
  const [scanQRCode, { data, loading, error }] = useMutation(SCAN_LOOT_BOX_QR);
  const [location, setLocation] = useState<any | undefined>();
  const [errorLocation, setErrorLocation] = useState<boolean>(false);
  const router = useRouter();
  const [scanError, setScanError] = useState<SCAN_ERROR | null>(null);

  useEffect(() => {
    if (location && router.isReady) {
      const { hash } = router.query;
      scanQRCode({
        variables: {
          input: {
            ...location,
            hash,
          },
        },
      }).catch((e) => {
        const isOutsideEventScan = (e.message as string).includes(
          "ongoing event"
        );
        const isNotFound = (e.message as string).includes("not found");
        if (isOutsideEventScan) {
          setScanError(SCAN_ERROR.SCAN_OUTSIDE_EVENT_ERROR);
        } else if (isNotFound) {
          setScanError(SCAN_ERROR.QR_CODE_NOT_FOUND);
        } else {
          setScanError(SCAN_ERROR.UNKNOWN_SCAN_ERROR);
        }
      });
    }
  }, [location, router, scanQRCode]);

  useEffect(() => {
    if (data && !error) {
      const { hash } = router.query;
      router.push(`/loot/${hash}`);
    }
  }, [data, error, router]);

  const locationAccepted = (position: any) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
    setErrorLocation(false);
  };
  const locationRefused = () => {
    setErrorLocation(true);
    setLocation(undefined);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(locationAccepted, locationRefused);
  }, []);

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(locationAccepted, locationRefused);
  };

  return (
    <Grid container spacing={0} sx={{ minHeight: "100vh" }}>
      {error ? (
        <ErrorText error={scanError} />
      ) : (
        <>
          <Grid item xs={12}>
            <Logo />
          </Grid>
          <Grid item xs={12} sx={{ mt: 4, p: 4 }}>
            <Typography
              textAlign="center"
              color={errorLocation ? "red" : "black"}
            >
              To participate in the Advent Calendar, please enable geolocation.
            </Typography>
          </Grid>
          <Grid item mt={2} xs={12} sx={{ p: 4 }}>
            <LoadingButton
              fullWidth
              loading={loading || !location}
              variant="contained"
              onClick={handleLocation}
              startIcon={<NearMeRounded />}
            >
              Enable geolocation
            </LoadingButton>
          </Grid>
        </>
      )}
    </Grid>
  );
}

const NoOutgoingEvent = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_UPCOMING_EVENT);
  const nextEventStartDate = error
    ? moment().add(7, "d").toDate()
    : data?.upcomingEvent?.startDate;

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(12, 11, 11, 1) 0%, rgba(32, 33, 70, 1) 45%, rgba(51, 63, 123, 1) 100%)",
      }}
    >
      <Box
        position="absolute"
        width="100%"
        height="100vh"
        sx={{ backgroundImage: 'url("/images/flocon-bg.svg")' }}
      />
      <Typography textAlign="center" variant="h1" mx={3} my={4} color="primary">
        Just a little patience...
      </Typography>
      <Typography color="white" textAlign="center">
        The calendar opens its doors in:
      </Typography>
      <Box mt={4} display="flex" justifyContent="center">
        {loading ? (
          <Skeleton width="100%" height={40} />
        ) : (
          <Countdown
            date={nextEventStartDate}
            renderer={({ days, hours, minutes, seconds }) => {
              return days > 0 ? (
                <Box display="flex">
                  <CountdownCell label="days" value={days} />
                  <CountdownCell label="hours" value={hours} />
                  <CountdownCell label="minutes" value={minutes} />
                </Box>
              ) : (
                <Box display="flex">
                  <CountdownCell label="hours" value={hours} />
                  <CountdownCell label="minutes" value={minutes} />
                  <CountdownCell label="seconds" value={seconds} />
                </Box>
              );
            }}
          />
        )}
      </Box>

      <Box position="relative" px={4} mt={15} height="50vh">
        <Typography textAlign="justify" pt={4}>
          The Advent Calendar will be available{" "}
          <b>every Sunday, from December 3 to December 24, 2023</b>. Scan this
          box or one of the 3,000 spread throughout Romandie from next Sunday to
          try to win fabulous gifts!
        </Typography>
      </Box>

      <BottomButton onClick={() => router.push("/")}>
        {"Discover the gifts!"}
      </BottomButton>
    </Box>
  );
};
