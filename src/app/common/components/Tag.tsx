import { Typography, useTheme, Box, Skeleton } from "@mui/material";
import { FC } from "react";

export type TagColor = "success" | "info" | "warning" | "error" | "primary";

interface TagProps {
  value: string;
  color?: TagColor;
  dense?: boolean;
  loading?: boolean;
}

const Tag: FC<TagProps> = ({ value, color = "success", dense, loading }) => {
  const theme = useTheme();
  if (loading) {
    return (
      <Box display="flex" justifyContent="end">
        <Skeleton width="30%" height={20} />
      </Box>
    )
  }

  return (
    <Typography
      variant="body1"
      sx={{
        bgcolor: color
          ? theme.palette[color]?.light
          : theme.palette.success.light,
        borderRadius: 2,
        paddingX: dense ? 1 : 2,
        paddingY: dense ? 0 : 1,
      }}
      color={
        color
          ? theme.palette[color]?.contrastText
          : theme.palette.success.contrastText
      }
      textTransform="capitalize"
      display="inline-flex"
    >
      {value}
    </Typography>
  );
};

export default Tag;
