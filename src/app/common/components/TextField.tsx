import * as React from "react";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps
} from "@mui/material/TextField";
import Box from "@mui/material/Box";

const TextField = React.forwardRef<
  HTMLInputElement,
  MuiTextFieldProps & { counter?: boolean }
>((props, ref) => {
  const { counter = false, onFocus, onBlur, helperText, ...other } = props;

  if (counter && !props.inputProps?.maxLength) {
    throw new Error("counter needs maxLength to be set on inputProps");
  }
  if (counter && props.type !== "text") {
    throw new Error("invalid input type");
  }

  const [visible, setVisible] = React.useState(false);

  return (
    <MuiTextField
      ref={ref}
      {...other}
      onFocus={(event) => {
        setVisible(true);
        onFocus && onFocus(event);
      }}
      onBlur={(event) => {
        setVisible(false);
        onBlur && onBlur(event);
      }}
      helperText={
        <Box
          component="span"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{helperText}</span>
          {visible && counter && (
            <span>
              {`${(props.value as string).length} / ${
                props.inputProps?.maxLength
              }`}
            </span>
          )}
        </Box>
      }
    />
  );
});

TextField.displayName = "TextField";

export default TextField;