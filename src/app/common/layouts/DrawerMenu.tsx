import {
  Divider,
  Drawer,
  DrawerProps,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import Navigation from "./Navigation";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { FC } from "react";

export const DRAWER_WIDTH = 264;

interface DrawerMenuProps extends DrawerProps {
  onClose?: () => void;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const DrawerMenu: FC<DrawerMenuProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const handleDrawerClose = () => {
    onClose && onClose();
  };

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
        },
      }}
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeft color="primary" />
          ) : (
            <ChevronRight color="primary" />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Navigation />
    </Drawer>
  );
};

export default DrawerMenu;
