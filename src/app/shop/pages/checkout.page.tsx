import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { withTranslations } from "@core/intl";
import { BottomButton } from "@app/common/components";
import { useSession } from "next-auth/react";
import { withAuth } from "@app/auth";
import { useRouter } from "next/router";
import { CartItem } from "../types/product";
import { useState } from "react";
import { useCart, useCheckoutForm } from "../state";
import { ShoppingCartRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { formData } = useCheckoutForm();
  const { cart, calculateCartTotal, resetCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const handleSubmit = async () => {
    // TODO: trigger transfer ERC20 token and wait for tx id
    try {
      // TODO: Extract into a hook with loading state.
      setLoading(true);
      if (true /*data*/) {
        resetCart();
        router.push("/shop/order-confirmation");
        setLoading(false);
      } else {
        console.log(error);
        setLoading(false);
        setError(Error("ShopError: Error creating the order."));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container sx={{ px: 4 }} maxWidth="lg">
      <Box mt={16} mb={16}>
        <Typography variant="h3" fontWeight={600} textAlign="left">
          Votre commande
        </Typography>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700}>
            Panier
          </Typography>
          <Button
            variant="text"
            startIcon={<ShoppingCartRounded />}
            sx={{ pr: 0, mr: 0 }}
            onClick={() => router.push("/shop")}
          >
            {`Ajouter d'autres cadeaux`}
          </Button>
        </Box>

        <Paper
          sx={{
            bgcolor: grey[200],
            mb: 2,
            p: 2,
            borderRadius: 4,
          }}
          elevation={0}
        >
          <Typography textOverflow="ellipsis" noWrap mb={1}>
            {`Vos cadeaux: `}
          </Typography>
          {cart.map((item: CartItem) => (
            <Typography noWrap key={item.id} fontWeight={600}>
              {`${item.title} (${item.quantity}x)`}
            </Typography>
          ))}
        </Paper>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700}>
            Adresse de livraison
          </Typography>
          <Button
            variant="text"
            sx={{ pr: 0, mr: 0 }}
            onClick={() => router.push("/shop/shipping-address")}
          >
            {`Modifier`}
          </Button>
        </Box>
        <Paper
          sx={{
            bgcolor: grey[200],
            mb: 2,
            p: 2,
            borderRadius: 4,
          }}
          elevation={0}
        >
          <Typography>
            {`${formData.address}, ${formData.postalCode} ${formData.city}`}
          </Typography>
        </Paper>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700}>
            Total
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
          >{`${calculateCartTotal()} POINTS`}</Typography>
        </Box>

        {error && (
          <Alert variant="filled" severity="error" sx={{ mt: 2, mb: 2 }}>
            {`Une erreur c'est produite lors de votre commande, veuillez réessayer ultérieurement.`}
          </Alert>
        )}

        <BottomButton
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
        >
          {`Utiliser ${calculateCartTotal()} points`}
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("shop")());
