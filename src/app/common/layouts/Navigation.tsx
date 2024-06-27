import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import NavigationItems from "./navigation-items";
import { NavigationItemType } from "../types/navigation";
import { ConnectButton } from "thirdweb/react";
import {
  accountAbstraction,
  chain,
  client,
  config,
  wallets,
} from "@core/thirdweb";

const Navigation = () => {
  const router = useRouter();

  return (
    <List>
      <ListItem>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={config.theme}
          connectModal={config.connectModal}
          chain={chain}
          accountAbstraction={accountAbstraction}
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
