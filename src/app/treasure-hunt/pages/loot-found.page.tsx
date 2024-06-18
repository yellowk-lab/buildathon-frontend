/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import AdventContainer from "@app/treasure-hunt/components/AdventContainer";
import ContactForm from "@app/treasure-hunt/components/ContactForm";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_LOOT_BOX_BY_HASH } from "@app/treasure-hunt/gql/query";
import {
  CLAIM_LOOT_BOX,
  PRIZE_DRAW_REGISTRATION,
} from "@app/treasure-hunt/gql/mutation";
import { Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { getImageOf } from "@app/treasure-hunt/utils/image-prize";

const textWinner = {
  title: "Congratulations!",
  message: "Here is the prize you've won:",
};

const textLosing = {
  title: "No luck!",
  message: "This box has already been opened or does not contain a prize…",
};

const LootFoundPage: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [getLoot, { data, loading }] = useLazyQuery(GET_LOOT_BOX_BY_HASH);
  const [claimPrize] = useMutation(CLAIM_LOOT_BOX);
  const [prizeDrawRegistration] = useMutation(PRIZE_DRAW_REGISTRATION);
  const lootBox = data?.lootBoxByHash || undefined;

  useEffect(() => {
    if (router.isReady) {
      const { hash } = router.query;
      getLoot({
        variables: {
          hash,
        },
      });
    }
  }, [getLoot, router]);

  let prizeMessage: React.ReactNode = (
    <>
      <Typography textAlign="center" mt={2}>
        Continue scanning other boxes for more surprises.
      </Typography>
      <Typography textAlign="center" mb={2} mt={1}>
        {`Don't forget to register for the raffle and try to win a big prize!`}
      </Typography>
    </>
  );
  let textParticipation = textLosing;
  if (lootBox && lootBox.loot && lootBox.openedById === null) {
    const { loot } = lootBox;
    textParticipation = textWinner;
    prizeMessage = (
      <>
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          my={2}
        >
          <img
            src={getImageOf(loot.name)}
            alt={loot.displayName}
            height="200vw"
          />
          <Typography color="white" mt={2} variant="subtitle2">
            {loot.displayName}
          </Typography>
        </Stack>
      </>
    );
  }

  const handleClaim = async (email: string) => {
    const { hash } = router.query;
    try {
      await claimPrize({
        variables: {
          input: {
            email,
            lootBoxId: lootBox.id,
          },
        },
      });
      setError(undefined);
      router.push(`/loot/${hash}/thank-you`);
    } catch {
      setError("An error occurred, please try again");
    }
  };

  const handleDrawRegistration = async (email: string) => {
    const { hash } = router.query;
    try {
      await prizeDrawRegistration({
        variables: {
          email,
        },
      });
      setError(undefined);
      router.push(`/loot/${hash}/thank-you`);
    } catch {
      setError("An error occurred, please try again");
    }
  };

  const handleSubmitForm = async (email: string) => {
    const isWinner = lootBox && lootBox.loot && lootBox.openedById === null;
    if (isWinner) {
      await handleClaim(email);
    } else {
      await handleDrawRegistration(email);
    }
  };
  const isWinner = lootBox && lootBox.loot && lootBox.openedById === null;
  return (
    <AdventContainer
      foundOtherBox
      isLoading={loading}
      title={textParticipation.title}
      message={textParticipation.message}
      messageChildren={prizeMessage}
    >
      {error && (
        <Box pt={2}>
          <Typography color="red">{error}</Typography>
        </Box>
      )}
      <Box pt={2}>
        <ContactForm
          winner={isWinner}
          onSubmit={handleSubmitForm}
          loading={loading}
        />
      </Box>
    </AdventContainer>
  );
};

export default LootFoundPage;
