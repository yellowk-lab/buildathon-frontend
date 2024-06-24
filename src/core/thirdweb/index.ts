import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { base, baseSepolia } from "thirdweb/chains";

const isMainnet: boolean = process.env.NEXT_PUBLIC_CHAIN_IS_MAINNET! === "base";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const wallets = [
  createWallet("com.coinbase.wallet"),
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook"],
    },
  }),
];

export const chain = defineChain(isMainnet ? base : baseSepolia);
