import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { LootBox } from "@app/treasure-hunt/types/loot-box";
import LootItem from "./LootItem";
import { grey } from "@mui/material/colors";

export interface LootListProps {
  lootBoxes: LootBox[];
  loading: boolean;
}

export const LootList: FC<LootListProps> = ({ lootBoxes, loading }) => {
  if (loading) {
    return [0, 1, 2, 3, 4].map((_, index) => <PrizeItemSkeleton key={index} />);
  }
  return lootBoxes.length > 0 ? (
    <Box>
      {lootBoxes.map((lootBox: LootBox, i) => (
        <LootItem
          key={i}
          title={lootBox.loot.name}
          lootNftId={lootBox.lootNftId}
          imageUrl={lootBox.loot.imageUrl}
          redeemed={lootBox.lootRedeemed}
        />
      ))}
    </Box>
  ) : (
    <Paper elevation={0} sx={{ bgcolor: grey[200], p: 4, mb: 4 }}>
      <Typography color="text.secondary">{`You don't have any gift yet.`}</Typography>
    </Paper>
  );
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
