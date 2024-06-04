import { FaceRounded, LogoutRounded } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ConnectedAccountChip() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return session ? (
    <>
      <Chip
        avatar={<Avatar>{email?.substring(0, 1).toUpperCase()}</Avatar>}
        label={email}
        sx={{ py: 4, width: "100%" }}
        color="secondary"
        onClick={handleClick}
      />
      <Menu open={menuOpen} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <LogoutRounded fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText color="error">{"Me déconnecter"}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <Button
      color="primary"
      variant="contained"
      onClick={() => router.push("/auth/signin")}
      startIcon={<FaceRounded />}
      sx={{ width: "100%" }}
    >
      Connexion
    </Button>
  );
}
