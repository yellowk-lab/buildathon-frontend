import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import SparklyLMDCoin from "@assets/images/sparkly-lmd-coin.svg";
import { FC } from "react";

interface CoinBalanceProps {
  amount: number;
  label: string;
  loading?: boolean;
  symbol?: string;
}

export const CoinBalance: FC<CoinBalanceProps> = ({
  amount,
  label,
  loading,
  symbol = "$LMD",
}) => {
  const theme = useTheme();

  return (
    <Box
      borderRadius={18}
      bgcolor={theme.palette.secondary.main}
      px={4}
      py={3}
      sx={{ position: "relative" }}
      display="flex"
      justifyContent="right"
      mt={6}
      mb={6}
    >
      <Box sx={{ position: "absolute", top: -5, left: 0 }}>
        <Image src={SparklyLMDCoin} width={120} alt="" />
      </Box>
      <Box mr={3}>
        {loading ? (
          <Skeleton variant="rectangular" height={28} />
        ) : (
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
          >{`${amount} ${symbol.toUpperCase()}`}</Typography>
        )}
        <Typography fontWeight={700}>{label}</Typography>
      </Box>
    </Box>
  );
};

export default CoinBalance;
