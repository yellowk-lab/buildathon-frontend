import React, { FC, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Skeleton,
  Paper,
  Box,
  IconButton,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { AddRounded, RemoveRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

interface ProductItemProps {
  id: string;
  title: string;
  price: number;
  symbol: string;
  imageUrl: string;
  quantityButtonDisabled: boolean;
  onQuantityChange: (quantity: number) => void;
  quantity: number;
  stock: number;
  initialStock: number;
}

const ProductItem: React.FC<ProductItemProps> = ({
  title,
  imageUrl,
  price,
  symbol,
  quantityButtonDisabled,
  onQuantityChange,
  quantity,
  stock,
  initialStock,
}) => {
  const theme = useTheme();

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
      {stock <= 0 && (
        <Box
          position="absolute"
          width="100%"
          bgcolor="white"
          height="100%"
          left={0}
          top={0}
          zIndex={100}
          sx={{ opacity: 0.4 }}
        />
      )}
      <Grid container display="flex" alignItems="center">
        <Grid item xs={3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} width={60} />
        </Grid>
        <Grid item xs={6} alignSelf="center">
          <Typography variant="h6" fontWeight={700} color={grey[800]}>
            {title}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color={theme.palette.primary.main}
            mt={0.5}
          >{`${price} ${symbol}`}</Typography>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
          <QuantityButton
            disabled={quantityButtonDisabled || stock <= 0}
            onChange={(value) => onQuantityChange(value || 0)}
            value={quantity}
          />
        </Grid>
      </Grid>
      <Box>
        <Box width="100%">
          <LinearProgress
            variant="determinate"
            value={(1 - stock / initialStock) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: 16,
              mr: 1,
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35, mt: 0.5 }}>
          <Typography variant="body2" color="primary">
            {stock > 0
              ? `Plus que ${stock} disponibles`
              : `Plus de stock disponible`}
          </Typography>
        </Box>
      </Box>
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

export default ProductItem;
