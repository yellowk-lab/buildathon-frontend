import { Box, Stack, Switch, Typography } from "@mui/material";
import { ChangeEvent } from "react";

interface SwitchInputProps {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SwitchInput({
  id,
  name,
  label,
  helperText,
  checked,
  onChange,
}: SwitchInputProps) {
  return (
    <Box display="flex" alignItems="start" justifyContent="space-between">
      <Stack>
        <Typography variant="h6">{label}</Typography>
        <Typography>{helperText}</Typography>
      </Stack>
      <Box ml={4}>
        <Switch id={id} name={name} onChange={onChange} checked={checked} />
      </Box>
    </Box>
  );
}
