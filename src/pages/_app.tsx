import "@core/styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { metadata } from "@core/config";
import { BreadcrumbProvider } from "@app/common/components";
import { MainLayout } from "@app/common/layouts";
import { StylesProvider } from "@core/styles";
import ApolloProviderWrapper from "@core/apollo/ApolloProviderWrapper";
import { AppProps } from "next/app";
import { EmotionCache } from "@emotion/cache";
import { IntlProvider } from "@core/intl";
import { useRouter } from "next/router";
import { chains, wagmiClient } from "@core/web3";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import theme from "@core/styles/theme/index";
import "moment/locale/fr";
import "@core/validation/yup-extensions";
import moment from "moment";
import AuthProvider from "@app/auth/components/AuthProvider";
import { Analytics } from "@vercel/analytics/react";

export interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: {
    session?: any;
    locales?: any;
  };
}
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const router = useRouter();
  const { locale } = router;

  moment.locale(locale || "en");

  return (
    <StylesProvider>
      <IntlProvider locales={pageProps.locales}>
        <Head>
          <title>{`${metadata.name}`}</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Analytics />
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: theme.palette.primary.main,
              borderRadius: "large",
            })}
            coolMode
          >
            <ApolloProviderWrapper>
              <AuthProvider session={session}>
                <MainLayout>
                  <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={6000}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <BreadcrumbProvider>
                      <Component {...pageProps} />
                    </BreadcrumbProvider>
                  </SnackbarProvider>
                </MainLayout>
              </AuthProvider>
            </ApolloProviderWrapper>
          </RainbowKitProvider>
        </WagmiConfig>
      </IntlProvider>
    </StylesProvider>
  );
}
