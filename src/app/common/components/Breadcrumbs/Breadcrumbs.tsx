import { useRouter } from "next/router";
import { useBreadcrumb } from "./BreadcrumbContext";
import { Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import Link from "next/link";

export default function Breadcrumbs() {
  const router = useRouter();
  const { breadcrumbs } = useBreadcrumb();
  const pathnames = router.asPath.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs
      separator={<NavigateNext fontSize="small" />}
      maxItems={3}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    >
      <BreadcrumbItem to="/" displayName="Dashboard" />
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const displayName = breadcrumbs[to] || value;
        const isCurrent = index === pathnames.length - 1;

        return (
          <BreadcrumbItem
            displayName={displayName}
            to={to}
            isCurrent={isCurrent}
            key={to}
          />
        );
      })}
    </MUIBreadcrumbs>
  );
}

interface BreadcrumbItemProps {
  displayName: string;
  isCurrent?: boolean;
  to: string;
}

const BreadcrumbItem = ({
  displayName,
  isCurrent,
  to,
}: BreadcrumbItemProps) => {
  const capitalizedDisplayName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);
  return isCurrent ? (
    <Typography color="textPrimary">{capitalizedDisplayName}</Typography>
  ) : (
    <Link href={to}>{capitalizedDisplayName}</Link>
  );
};
