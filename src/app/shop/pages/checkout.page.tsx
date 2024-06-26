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
import { withAuth } from "@app/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCheckoutForm } from "../state";
import { ShoppingCartRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

export default function CheckoutPage() {
  const router = useRouter();
  const { formData, resetFormData } = useCheckoutForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const handleSubmit = async () => {
    // TODO: trigger transfer ERC20 token and wait for tx id
    const orderNumber = 5;
    try {
      setLoading(true);
      if (true /*data*/) {
        resetFormData();
        router.push(`/shop/order-confirmation?orderNumber=${5}`);
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
          Your order
        </Typography>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700}>
            Shopping cart
          </Typography>
          <Button
            variant="text"
            startIcon={<ShoppingCartRounded />}
            sx={{ pr: 0, mr: 0 }}
            onClick={() => router.push("/account")}
          >
            {`Change item`}
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
            {`Your item: `}
          </Typography>
          <Typography noWrap fontWeight={600}>
            {`${formData.lootName}`}
          </Typography>
        </Paper>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700}>
            Delivery address
          </Typography>
          <Button
            variant="text"
            sx={{ pr: 0, mr: 0 }}
            onClick={() => router.push("/shop/shipping-address")}
          >
            {`Update`}
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

        {error && (
          <Alert variant="filled" severity="error" sx={{ mt: 2, mb: 2 }}>
            {`An error occurred during your order, please try again later.`}
          </Alert>
        )}

        <BottomButton
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
        >
          {`Order`}
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("shop")());
