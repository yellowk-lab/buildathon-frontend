import React from "react";
import { Typography, Stack } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_PRIZE_LIST } from "@app/treasure-hunt/gql/query";
import PrizeItem, { PrizeItemSkeleton } from "./PrizeItem";
import { Prize, getImageOf } from "../utils/image-prize";

const PrizeList = () => {
  const { data, loading } = useQuery(GET_PRIZE_LIST);

  const formatPrize = (prize: Prize) => ({
    ...prize,
    imageUrl: getImageOf(prize.name),
    progressValue: prize.claimedSupply / prize.totalSupply,
  });
  const prizes = data?.loots.map(formatPrize) || [];
  return (
    <Stack>
      <Typography fontWeight="bold" my={2} id="prize-list">
        Gift list
      </Typography>
      {loading ? (
        <>
          <PrizeItemSkeleton />
          <PrizeItemSkeleton />
          <PrizeItemSkeleton />
          <PrizeItemSkeleton />
        </>
      ) : (
        prizes.map((prize: Prize) => (
          <PrizeItem
            key={prize.name}
            imageSrc={prize.imageUrl as string}
            title={prize.displayName}
            progressValue={prize.progressValue || 0}
            found={prize.claimedSupply}
            total={prize.totalSupply}
          />
        ))
      )}
    </Stack>
  );
};
export default PrizeList;
