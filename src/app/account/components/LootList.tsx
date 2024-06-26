import { Grid, Skeleton, Typography } from "@mui/material";
import { FC } from "react";
import { LootBox } from "@app/treasure-hunt/types/loot-box";
import LootItem from "./LootItem";

export interface LootListProps {
  lootBoxes: LootBox[];
  loading: boolean;
}

export const LootList: FC<LootListProps> = ({ lootBoxes, loading }) => {
  if (loading) {
    return [0, 1, 2, 3, 4].map((_, index) => <PrizeItemSkeleton key={index} />);
  }
  return lootBoxes.map((lootBox: LootBox, i) => (
    <LootItem
      key={i}
      title={lootBox.loot.name}
      lootNftId={lootBox.lootNftId}
      imageUrl={lootBox.loot.imageUrl}
      redeemed={lootBox.lootRedeemed}
    />
  ));
};

export const PrizeItemSkeleton = () => (
  <Grid container spacing={3} mb={1}>
    <Grid item xs={3}>
      <Skeleton width={60} height={60} />
    </Grid>
    <Grid item xs={9} alignSelf="center">
      <Typography mb={1} fontWeight="bold" color="gray">
        <Skeleton variant="text" />
      </Typography>
      <Skeleton variant="text" width={120} />
    </Grid>
  </Grid>
);
