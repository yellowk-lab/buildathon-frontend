import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { base, baseSepolia } from "thirdweb/chains";
import { ConnectButton_connectModalOptions, lightTheme } from "thirdweb/react";
import theme from "@core/styles/theme";

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

const connectModalOptions: ConnectButton_connectModalOptions = {
  size: "compact",
};

export const config = {
  theme: lightTheme({
    colors: {
      accentText: theme.palette.primary.main,
      accentButtonBg: theme.palette.primary.main,
      primaryButtonBg: theme.palette.primary.main,
    },
  }),
  connectModal: connectModalOptions,
};

export const chain = defineChain(isMainnet ? base : baseSepolia);

export const accountAbstraction = {
  chain: chain,
  sponsorGas: true,
  // overrides: {
  //   bundlerUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL,
  // },
};
