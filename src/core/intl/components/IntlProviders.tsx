import { NextIntlClientProvider } from "next-intl";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface IntlProviderWrapperProps {
  locales: any;
  children: React.ReactNode;
}

export const IntlProviderWrapper: React.FC<IntlProviderWrapperProps> = ({
  locales,
  children,
}) => {
  return (
    <NextIntlClientProvider messages={locales}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {children}
      </LocalizationProvider>
    </NextIntlClientProvider>
  );
};
