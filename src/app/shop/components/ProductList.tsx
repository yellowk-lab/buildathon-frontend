import { Grid, Skeleton, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { CartItem, Product } from "../types/product";
import { FC } from "react";

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  updateCart: (product: Product, quantity: number) => void;
  balance: number;
  cart: CartItem[];
}

export const ProductList: FC<ProductListProps> = ({
  products,
  loading,
  balance,
  updateCart,
  cart,
}) => {
  const handleQuantityChange = (product: Product, value: number) => {
    updateCart(product, value);
  };

  const getMatchingCartItem = (productId: string) => {
    return cart.find((item) => item.id === productId);
  };

  if (loading) {
    return [0, 1, 2, 3, 4].map((_, index) => <PrizeItemSkeleton key={index} />);
  }
  return products
    ?.sort((a, b) => b.stock - a.stock)
    .map((product: Product) => (
      <ProductItem
        key={product.id}
        title={product.title}
        id={product.id}
        imageUrl={product.imageUrl}
        price={product.priceInTokens}
        symbol="Points"
        onQuantityChange={(value) => handleQuantityChange(product, value)}
        quantityButtonDisabled={balance < product.priceInTokens}
        quantity={getMatchingCartItem(product.id)?.quantity || 0}
        stock={product.stock}
        initialStock={product.initial_stock}
      />
    ));
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
