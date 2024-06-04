import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/MenuRounded";
import { Logo } from "../components";
import { useRouter } from "next/router";
import DrawerMenu, { DRAWER_WIDTH } from "./DrawerMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: DRAWER_WIDTH,
  }),
}));

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (router.isReady) {
      handleDrawerClose();
    }
  }, [router]);

  return (
    <Box>
      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          padding: 4,
          py: 2,
          px: {
            xs: 2,
          },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Logo height={40} />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{
              ...(open && { display: "none" }),
              bgcolor: theme.palette.secondary.main,
            }}
          >
            <MenuIcon color="primary" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box>{children}</Box>

      <DrawerMenu open={open} onClose={handleDrawerClose} />
    </Box>
  );
};

export default MainLayout;
