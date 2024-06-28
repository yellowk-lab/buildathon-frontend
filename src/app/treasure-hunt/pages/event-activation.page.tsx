"use client";

import { Alert, Box, Button, Chip, Container, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";
import { withAuth } from "@app/auth";
import { BottomButton } from "@app/common/components";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACTIVE_EVENTS } from "../gql/treasure-hunt.queries";
import { UPDATE_EVENT } from "../gql/treasure-hunt.mutations";
import { Event } from "../types/event";
import { LoadingButton } from "@mui/lab";

export default function FeatureHomePage() {
  const router = useRouter();
  const eventId = router?.query?.eventId;
  const eventPassword = router?.query?.eventPassword;
  const [
    updateEventState,
    { data: eventUpdateData, loading: eventUpdateLoading },
  ] = useMutation(UPDATE_EVENT);
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    if (eventUpdateData) {
      const _event = eventUpdateData?.changeEventStatus;
      setEvent(_event);
    }
  }, [eventUpdateData]);

  const handleEventUpdate = (newStatus: string) => {
    if (eventId && eventPassword) {
      updateEventState({
        variables: {
          input: {
            eventId: eventId,
            newStatus,
          },
          password: eventPassword,
        },
      });
    }
  };

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
          {`Your Event`}
        </Typography>

        <Typography variant="h5" color="text.secondary" mt={2}>
          {event?.brand}
        </Typography>
        <Typography variant="h4">{event?.name}</Typography>
        <Typography variant="h6">
          Your event status:
          {` ${event?.status ?? "PENDING"}`}
        </Typography>

        <LoadingButton
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => handleEventUpdate("ACTIVE")}
          loading={eventUpdateLoading}
          disabled={event?.status === "ACTIVE"}
        >
          {`Activate event`}
        </LoadingButton>
        <LoadingButton
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => handleEventUpdate("CREATED")}
          loading={eventUpdateLoading}
          disabled={event?.status === "CREATED"}
        >
          {`Creation mode event`}
        </LoadingButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("treasure-hunt")());
