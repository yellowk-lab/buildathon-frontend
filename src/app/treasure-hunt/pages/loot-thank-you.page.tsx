import React from "react";
import { NextPage } from "next";
import AdventContainer from "@app/treasure-hunt/components/AdventContainer";
import { Box, Typography } from "@mui/material";
import PrizeList from "@app/treasure-hunt/components/PrizeList";
import { useRouter } from "next/router";
import { BottomButton } from "@app/common/components";

const ThankMessage = () => (
  <>
    <br />
    <Typography textAlign="center">
      {`The experience isn't over yet! Don't miss this unique chance to uncover
      even more gifts by scanning other boxes.`}
    </Typography>
  </>
);

const ThankPage: NextPage = () => {
  const router = useRouter();
  return (
    <AdventContainer
      foundOtherBox
      title="Thank you!"
      message="A confirmation email has been sent to you."
      messageChildren={<ThankMessage />}
    >
      <PrizeList />
      <Box height={100} />
      <BottomButton
        onClick={() => router.push("/treasure-hunt/map")}
        variant="contained"
      >
        {"Find more boxes!"}
      </BottomButton>
    </AdventContainer>
  );
};
export default ThankPage;
