import { NextIntlClientProvider } from "next-intl";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";

interface IntlProviderProps {
  locales: any;
  children: React.ReactNode;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({
  locales,
  children,
}) => {
  const { locale } = useRouter();

  return (
    <NextIntlClientProvider messages={locales} locale={locale}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {children}
      </LocalizationProvider>
    </NextIntlClientProvider>
  );
};
