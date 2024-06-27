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
import { useEffect, useState } from "react";
import { useCheckoutForm } from "../state";
import { ShoppingCartRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { getContract, prepareContractCall, waitForReceipt } from "thirdweb";
import { chain, client } from "@core/thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useMutation } from "@apollo/client";
import { REDEEM_LOOT } from "../gql/shop.mutations";

const LOOT_NFT_ADDRESS = process.env.NEXT_PUBLIC_LOOT_NFT_CONTRACT!;
const lootNftContract = getContract({
  client: client,
  chain: chain,
  address: LOOT_NFT_ADDRESS,
});

export default function CheckoutPage() {
  const router = useRouter();
  const { formData, resetFormData } = useCheckoutForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const smartAccount = useActiveAccount();
  const { mutateAsync, isPending, data, isSuccess } = useSendTransaction();
  const lootNftId: string = formData.lootNftId;
  const [
    redeemLoot,
    {
      data: lootRedeemData,
      loading: lootRedeemLoading,
      error: lootRedeemError,
    },
  ] = useMutation(REDEEM_LOOT);

  useEffect(() => {
    if (data && smartAccount?.address) {
      try {
        const input = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          lootNftId: formData.lootNftId,
          transactionHash: data.transactionHash,
          walletAddress: smartAccount.address,
        };
        redeemLoot({
          variables: {
            input: input,
          },
        });
      } catch (error: any) {
        setError(error);
      }
    }
  }, [data, smartAccount]);

  useEffect(() => {
    if (lootRedeemData) {
      resetFormData();
      router.push(
        `/shop/order-confirmation?orderNumber=${lootRedeemData?.redeemLoot?.id}`
      );
    }
  }, [lootRedeemData]);

  const handleContractTransfer = async () => {
    if (smartAccount?.address) {
      try {
        const transaction = prepareContractCall({
          contract: lootNftContract,
          method:
            "function transferFrom(address from, address to, uint256 tokenId)",
          params: [
            smartAccount.address,
            lootNftContract.address as `0x${string}`,
            BigInt(lootNftId),
          ],
          value: BigInt(0),
        });
        await mutateAsync(transaction);
      } catch (error: any) {
        console.log(error);
        setError(error);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      handleContractTransfer();
    } catch (e) {
      setError(Error("Error creating the order."));
    } finally {
      setLoading(false);
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
            {`An error occurred during your order, please try again later or contact support.`}
          </Alert>
        )}

        <BottomButton
          variant="contained"
          onClick={handleSubmit}
          loading={loading || isPending || lootRedeemLoading}
          disabled={lootRedeemData}
        >
          {`Order`}
        </BottomButton>
      </Box>
    </Container>
  );
}

export const getServerSideProps = withAuth(withTranslations("shop")());
