import React, { FC, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Skeleton,
  Paper,
  Box,
  IconButton,
  Button,
  Link,
} from "@mui/material";
import { AddRounded, RemoveRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { useCheckoutForm } from "@app/shop/state";
import { CheckoutFormData } from "@app/shop/types/checkout-form-data";
import { OPENSEA_URL } from "@core/config/constants";

const LOOT_NFT_ADDRESS = process.env.NEXT_PUBLIC_LOOT_NFT_CONTRACT;

interface LootItemProps {
  lootNftId: string;
  title: string;
  imageUrl: string;
  redeemed?: boolean;
}

const LootItem: React.FC<LootItemProps> = ({
  title,
  imageUrl,
  lootNftId,
  redeemed,
}) => {
  const router = useRouter();
  const { formData, updateFormData } = useCheckoutForm();

  const handleRedeem = (lootNftId: string) => {
    const values: CheckoutFormData = {
      ...formData,
      lootNftId,
      lootName: title,
    };
    updateFormData(values);
    router.push(`/shop/shipping-address`);
  };

  return (
    <Paper
      sx={{
        position: "relative",
        bgcolor: grey[200],
        mb: 2,
        p: 2,
        borderRadius: 4,
      }}
      elevation={0}
    >
      <Grid container display="flex" alignItems="center">
        <Grid item xs={4}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} width={78} />
        </Grid>
        <Grid item xs={8} alignSelf="center">
          <Typography variant="h6" fontWeight={700} color={grey[800]}>
            {title}
          </Typography>
          <Link
            underline="hover"
            target="_blank"
            href={`${OPENSEA_URL}/${LOOT_NFT_ADDRESS}/${lootNftId}`}
          >
            #{lootNftId} - View on OpenSea
          </Link>
          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={redeemed}
            onClick={() => handleRedeem(lootNftId)}
          >
            {redeemed ? `Already redeemed` : `Redeem`}
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export interface QuantityButtonProps {
  onChange?: (value?: number) => void;
  acceptNegativeValue?: boolean;
  minValue?: number;
  maxValue?: number;
  disabled: boolean;
  value: number;
}

export const QuantityButton: FC<QuantityButtonProps> = ({
  acceptNegativeValue,
  disabled,
  onChange,
  value,
}) => {
  const [quantity, setQuantity] = useState(value);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => prev - 1);

  useEffect(() => {
    onChange && onChange(quantity);
  }, [quantity]);

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={decrease}
        disabled={!acceptNegativeValue && quantity <= 0}
        color="primary"
      >
        <RemoveRounded />
      </IconButton>
      <Typography fontWeight={800} textAlign="center">
        {quantity}
      </Typography>
      <IconButton onClick={increase} color="primary" disabled={disabled}>
        <AddRounded />
      </IconButton>
    </Box>
  );
};

export const ProductItemSkeleton = () => (
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

export default LootItem;
