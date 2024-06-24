import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import NavigationItems from "./navigation-items";
import { NavigationItemType } from "../types/navigation";
import { ConnectButton, lightTheme } from "thirdweb/react";
import { chain, client, wallets } from "@core/thirdweb";
import { useTheme } from "@mui/material";

const Navigation = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <List>
      <ListItem>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={lightTheme({
            colors: {
              accentText: theme.palette.primary.main,
              accentButtonBg: theme.palette.primary.main,
              primaryButtonBg: theme.palette.primary.main,
            },
          })}
          connectModal={{ size: "compact" }}
          chain={chain}
        />
      </ListItem>
      {NavigationItems.map((item: NavigationItemType) => (
        <ListItem disablePadding key={item.id}>
          <ListItemButton
            disabled={item?.disabled}
            onClick={() => {
              router.push(item.href);
            }}
          >
            {item?.icon && (
              <ListItemIcon>
                <item.icon color="primary" />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Navigation;
