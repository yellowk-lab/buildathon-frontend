import { APP_DESCRIPTION, DISCORD_LINK, UNISWAP_URL } from "./constants";

// TODO: This should be extracted in a module.
import * as allChains from "new-wagmi-core/chains";
export type ChainName = keyof typeof allChains;
type SupportedChains = ChainName[];

// TODO: This should be handled properly.
const supportedChains = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS
  ? process.env.NEXT_PUBLIC_SUPPORTED_CHAINS.split(",")
  : ["baseSepolia", "base"];
// end

const config = {
  metadata: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    description: APP_DESCRIPTION,
    socials: {
      discord: DISCORD_LINK,
    },
  },
  // WEB3
  services: {
    alchemy: {
      API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    },
    uniswap: {
      uri: UNISWAP_URL,
      links: {
        swap: ({
          inputCurrency = "ETH",
          outputCurrency,
        }: {
          inputCurrency: string;
          outputCurrency: string;
        }) =>
          `${UNISWAP_URL}/#/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`,
      },
    },
  },
  network: {
    supportedChains: supportedChains as SupportedChains,
  },
};

export const { metadata, services, network } = config;
