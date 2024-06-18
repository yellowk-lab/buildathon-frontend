import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_UNCLAIMED_LOOTS } from "@app/treasure-hunt/gql/query";
import Link from "next/link";

const BoxBottom = styled(Box)<BoxProps>(() => ({
  position: "fixed",
  bottom: "45px",
  right: "10px",
  width: "90%",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "white",
  alignItems: "center",
  borderRadius: "49px",
  boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.2)",
}));

const SantaClause = styled(Box)<BoxProps>(() => ({
  background: "url('/images/papa-noel-le-matin-dimanche.png')",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  position: "fixed",
  bottom: "20px",
  right: "0",
  height: "100px",
  width: "100px",
}));
const MissingPrizesTracker = () => {
  const { data } = useQuery(GET_TOTAL_UNCLAIMED_LOOTS);
  const amountGift = data?.totalUnclaimedLoots.toString() || " - ";
  return (
    <BoxBottom>
      <SantaClause />
      <Link href="/">
        <Typography
          width="100%"
          variant="subtitle1"
          sx={{ pl: 4, cursor: "pointer" }}
        >
          Encore
          <Typography color="primary" component="span" fontWeight="bold">
            {` ${amountGift} cadeaux `}
          </Typography>
          à trouver !
        </Typography>
      </Link>
    </BoxBottom>
  );
};
export default MissingPrizesTracker;
