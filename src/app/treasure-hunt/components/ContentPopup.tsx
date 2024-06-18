import { Box, Grid, Typography } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  address: string;
}
const ContentPopup: React.FC<Props> = ({ title, address }) => (
  <>
    <Box width="100%" bgcolor="primary.main" px={2} py={1}>
      <Typography color="white">{title}</Typography>
    </Box>
    <Grid container px={2} py={3}>
      <Grid item>
        <Typography>
          <Typography component="span" color="grey">
            {` ${address}`}
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  </>
);
export default ContentPopup;
