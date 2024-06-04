import { Box, Container, Stack, Typography } from "@mui/material";
import { withTranslations } from "@core/intl";
import { BottomButton, CoinBalance } from "@app/common/components";
import { GET_PRODUCTS } from "../gql/shop.queries";
import { useSession } from "next-auth/react";
import { withAuth } from "@app/auth";
import { useRouter } from "next/router";
import { Product } from "../types/product";
import { ProductList } from "../components/ProductList";
import { useEffect, useState } from "react";
import { GET_ACCOUNT_DETAILS } from "@app/account/gql/account.queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useCart } from "../state";

export default function ShopPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [getAccountDetails, { data: balanceData, loading: balanceLoading }] =
    useLazyQuery(GET_ACCOUNT_DETAILS, {
      variables: { userId: session?.user?.id },
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    if (session?.user?.id) {
      getAccountDetails({
        variables: {
          userId: session.user.id,
        },
      });
    }
  }, [session]);
  const { data: productsData, loading: productsLoading } =
    useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState<Product[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const { cart, updateCart, calculateCartTotal } = useCart();

  useEffect(() => {
    if (productsData) {
      const marshalledProducts: Product[] =
        productsData?.productsCollection?.edges?.map((edge: any) => ({
          ...edge.node,
          imageUrl: edge.node.image_url,
          priceInTokens: edge.node.price_in_tokens,
        })) || [];
      setProducts(marshalledProducts);
    }
  }, [productsData]);

  useEffect(() => {
    if (balanceData) {
      setInitialBalance(balanceData?.getuserinfo?.pointsAvailable || 0);
      setAvailableBalance(balanceData?.getuserinfo?.pointsAvailable || 0);
    }
  }, [balanceData]);

  useEffect(() => {
    const cartTotal = calculateCartTotal();
    setAvailableBalance(initialBalance - cartTotal);
  }, [cart]);

  return (
    <Container sx={{ px: 4 }} maxWidth="lg">
      <Box mt={16} mb={16}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Boutique
        </Typography>

        <CoinBalance
          amount={availableBalance}
          label="votre solde"
          loading={balanceLoading}
          symbol="points"
        />

        <Typography variant="h5" fontWeight={700}>
          Choisissez vos cadeaux
        </Typography>

        <Stack sx={{ mt: 2 }}>
          <ProductList
            products={products}
            loading={productsLoading}
            updateCart={updateCart}
            balance={availableBalance}
            cart={cart}
          />
        </Stack>

        <BottomButton
          variant="contained"
          onClick={() => router.push("/shop/shipping-address")}
          disabled={cart.length <= 0}
        >
          Commander
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("account")());
