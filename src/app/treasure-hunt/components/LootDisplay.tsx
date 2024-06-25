import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { FC } from "react";
import EmptyLootBox from "@assets/images/treasure-hunt/loot-box-empty.png";

export const LootDisplay: FC<{ imageUrl?: string; title: string }> = ({
  imageUrl,
  title,
}) => {
  const theme = useTheme();
  return (
    <Box textAlign="center">
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        borderRadius={8}
        bgcolor={theme.palette.secondary.main}
        mt={2}
      >
        <Image
          src={imageUrl || EmptyLootBox}
          alt="Gift box."
          width="200"
          height="200"
        />
      </Box>
      <Typography mt={3} variant="h4" fontWeight={600} color={grey[900]}>
        {title}
      </Typography>
    </Box>
  );
};
