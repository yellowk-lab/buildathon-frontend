import React from "react";
import { Box, BoxProps, Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";

type BottomButtonProps = ButtonProps & {
  loading?: boolean;
};

const BoxBottom = styled(Box)<BoxProps>(() => ({
  position: "fixed",
  bottom: "20px",
  left: "0",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  zIndex: 10000,
}));

const BottomButton: React.FC<BottomButtonProps> = (props) => {
  return (
    <BoxBottom>
      <LoadingButton
        {...props}
        style={{
          width: "90%",
        }}
      />
    </BoxBottom>
  );
};
export default BottomButton;
