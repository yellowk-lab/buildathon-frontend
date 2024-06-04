import React, { ReactNode } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SxProps,
  Theme,
  Alert,
  FormLabel,
} from "@mui/material";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export const UNAVAILABLE_COUNTRIES = [
  "AU", // Australia
  "CA", // Canada
  "HK", // Hong Kong SAR China
  "JP", // Japan
  "MX", // Mexico
  "NZ", // New Zealand
  "SG", // Singapore
  "TH", // Thailand
  "AE", // United Arab Emirates
  "US", // United States
];

interface CountryDropdownProps {
  value: string;
  onChange: (event: any) => void;
  error?: boolean;
  helperText?: ReactNode;
  label?: string;
  id?: string;
  sx?: SxProps<Theme> | undefined;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  error,
  helperText,
  id = "country-select",
  sx,
}) => {
  const countryList = countries.getNames("en", { select: "official" });

  return (
    <FormControl fullWidth error={error} sx={sx}>
      <FormLabel sx={{ mb: 0.5 }}>Country of residency</FormLabel>
      <Select labelId={`${id}-label`} id={id} value={value} onChange={onChange}>
        {Object.entries(countryList).map(([code, name]) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {helperText}
        </Alert>
      )}
    </FormControl>
  );
};

export default CountryDropdown;
