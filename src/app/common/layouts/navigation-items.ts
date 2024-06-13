import { NavigationItemType } from "@app/common/types/navigation";
import {
  AccountBoxRounded,
  HomeRounded,
  MapRounded,
  StoreRounded,
} from "@mui/icons-material";

export const NavigationItems: NavigationItemType[] = [
  {
    id: "home",
    label: "Home",
    icon: HomeRounded,
    href: "/",
  },
  {
    id: "account",
    label: "My account",
    icon: AccountBoxRounded,
    href: "/account",
    disabled: true,
  },
  {
    id: "map",
    label: "Map",
    icon: MapRounded,
    href: "/treasure-hunt/map",
  },
  {
    id: "shop",
    label: "Shop",
    icon: StoreRounded,
    disabled: true,
    href: "/shop",
  },
];

export default NavigationItems;
