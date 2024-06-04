"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { palette } from "./palette";
import { components } from "./components";
import { typography } from "./typography";

let theme = createTheme();

theme = createTheme({
  palette: palette(theme),
  components,
  typography: typography(theme),
});

theme = responsiveFontSizes(theme);

export default theme;
