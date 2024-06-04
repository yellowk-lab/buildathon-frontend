import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import { emotionCache } from "@core/styles/createEmotionCache";
import theme from "@core/styles/theme/index";

interface StylesProviderProps {
  children: ReactNode;
}

const StylesProvider: React.FC<StylesProviderProps> = ({ children }) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default StylesProvider;
