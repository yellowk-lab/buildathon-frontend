import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";

interface Props {
  title: string;
  message: string;
  children: React.ReactNode;
  messageChildren?: React.ReactNode;
  foundOtherBox?: boolean;
  isLoading?: boolean;
}

const AdventContainer: React.FC<Props> = ({
  title,
  message,
  children,
  messageChildren,
  isLoading,
}) => {
  return (
    <>
      <Box pb={10}>
        <Grid container px={5}>
          <Grid item xs={12}>
            {isLoading ? (
              <Skeleton variant="text" width={200} height={80} />
            ) : (
              <Typography textAlign="center" variant="h1" mx={3} mb={3} mt={3}>
                {title}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {isLoading ? (
              <Skeleton variant="text" width={400} height={20} />
            ) : (
              <Typography textAlign="center">{message}</Typography>
            )}
          </Grid>
          {isLoading ? <Skeleton width={400} height={40} /> : messageChildren}
        </Grid>
      </Box>
      <Box mt={4} position="relative" px={5}>
        {children}
      </Box>
    </>
  );
};

export default AdventContainer;
