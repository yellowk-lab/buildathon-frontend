import { NavigationItemType } from "@app/common/types/navigation";
import {
  AccountBoxRounded,
  DocumentScannerRounded,
  HomeRounded,
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
    label: "Mon compte",
    icon: AccountBoxRounded,
    href: "/account",
  },
  {
    id: "home",
    label: "Scanner",
    icon: DocumentScannerRounded,
    href: "/scan/articles",
  },
  {
    id: "shop",
    label: "Boutique",
    icon: StoreRounded,
    href: "/shop",
  },
];

export default NavigationItems;
