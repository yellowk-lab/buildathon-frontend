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
import { useRouter } from "next/router";
import "moment/locale/fr";
import "@core/validation/yup-extensions";
import moment from "moment";
import AuthProvider from "@app/auth/components/AuthProvider";
import { Analytics } from "@vercel/analytics/react";
import { IntlProvider } from "@core/intl/components/IntlProviders";
import { ThirdwebProvider } from "thirdweb/react";

export interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: {
    session?: any;
    locales?: any;
  };
}
export default function App({
  Component,
  pageProps: { session, locales, ...pageProps },
}: CustomAppProps) {
  const router = useRouter();
  const { locale } = router;
  moment.locale(locale || "en");

  return (
    <StylesProvider>
      <IntlProvider locales={locales}>
        <Head>
          <title>{`${metadata.name}`}</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Analytics />
        <ThirdwebProvider>
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
          </ApolloProviderWrapper>{" "}
        </ThirdwebProvider>
      </IntlProvider>
    </StylesProvider>
  );
}
