import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { metadata, services, network } from "@core/config";

import * as allChains from "new-wagmi-core/chains";

const { chains, provider } = configureChains(
  network.supportedChains.map((chainName) => allChains[chainName]),
  [alchemyProvider({ apiKey: services.alchemy.API_KEY }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: `${metadata.name} App`,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, wagmiClient, provider };
