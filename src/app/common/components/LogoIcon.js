import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import Logo from "@assets/brand/logo.png";

const LogoIcon = ({ height = 30 }) => {
  return (
    <Link href="/" alignItems="center" display="flex">
      <Image src={Logo} alt={"logo."} height={height} />
    </Link>
  );
};

export default LogoIcon;
