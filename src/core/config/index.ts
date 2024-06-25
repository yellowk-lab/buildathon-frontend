import { APP_DESCRIPTION, DISCORD_LINK, UNISWAP_URL } from "./constants";

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
};

export const { metadata, services } = config;
