import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ConnectedAccountChip from "@app/account/components/ConnectedAccountChip";
import {
  AccountBoxRounded,
  DocumentScannerRounded,
  StoreRounded,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import NavigationItems from "./navigation-items";
import { NavigationItemType } from "../types/navigation";

const Navigation = () => {
  const router = useRouter();

  return (
    <List>
      <ListItem>
        <ConnectedAccountChip />
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
