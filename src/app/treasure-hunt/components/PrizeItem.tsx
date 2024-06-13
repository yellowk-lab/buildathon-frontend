import React from "react";
import { Grid, Typography, LinearProgress, Skeleton } from "@mui/material";

interface Props {
  imageSrc: string;
  title: string;
  progressValue: number;
  found: number;
  total: number;
}
const PrizeItem: React.FC<Props> = ({
  imageSrc,
  title,
  progressValue,
  found,
  total,
}) => {
  return (
    <Grid container spacing={3} mb={1}>
      <Grid item xs={3}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={title} width={60} />
      </Grid>
      <Grid item xs={9} alignSelf="center">
        <Typography mb={1} fontWeight="bold" color="gray">
          {title}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressValue * 100}
          style={{
            height: 10,
            borderRadius: 5,
          }}
        />
        <Typography
          variant="caption"
          color="primary"
        >{`${found} found on ${total}`}</Typography>
      </Grid>
    </Grid>
  );
};

export const PrizeItemSkeleton = () => (
  <Grid container spacing={3} mb={1}>
    <Grid item xs={3}>
      <Skeleton width={60} height={60} />
    </Grid>
    <Grid item xs={9} alignSelf="center">
      <Typography mb={1} fontWeight="bold" color="gray">
        <Skeleton variant="text" width={120} />
      </Typography>
      <Skeleton height={10} />
      <Skeleton variant="text" width={120} />
    </Grid>
  </Grid>
);
export default PrizeItem;
