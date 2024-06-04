import { TextField, Typography, useTheme } from "@mui/material";
import { useField } from "formik";
import { ChangeEvent } from "react";

interface SocialAccountFieldProps {
  name: string;
  label: string;
  baseUrl: string;
  username: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: any) => void;
}

export default function SocialAccountField({
  name,
  label,
  baseUrl,
  username,
  onChange,
  onBlur,
  ...props
}: SocialAccountFieldProps) {
  const theme = useTheme();
  const [field, { touched, error }] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      id={name}
      name={name}
      label={label}
      InputProps={{
        startAdornment: (
          <Typography variant="inherit" color={theme.palette.text.disabled}>
            {baseUrl}
          </Typography>
        ),
      }}
      value={username}
      onChange={onChange}
      onBlur={onBlur}
      sx={{ mt: 2 }}
      error={touched && Boolean(error)}
      helperText={touched && error}
    />
  );
}
