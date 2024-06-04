import { SvgIconComponent } from "@mui/icons-material";

export type NavigationItemType = {
  id: string;
  href: string;
  label: string;
  icon?: SvgIconComponent;
  disabled?: boolean;
};
