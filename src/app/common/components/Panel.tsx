import { Paper, Box, Grid } from "@mui/material";
import React from "react";

interface PanelProps {
  children: React.ReactNode;
  sx?: any;
  disablePaper?: boolean;
}

interface PanelHeaderProps {
  children: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ children }) => {
  return <Box>{children}</Box>;
};

export const Panel: React.FC<PanelProps> = ({ children, sx, disablePaper }) => {
  const header = React.Children.toArray(children).find(
    (child) => (child as React.ReactElement).type === PanelHeader
  );
  const content = React.Children.toArray(children).filter(
    (child) => (child as React.ReactElement).type !== PanelHeader
  );

  return (
    <Grid container direction="column" spacing={2} sx={sx}>
      {header && <Grid item>{header}</Grid>}
      <Grid item>
        {disablePaper ? (
          <Box>{content}</Box>
        ) : (
          <Paper elevation={3}>
            <Box p={3}>{content}</Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};
