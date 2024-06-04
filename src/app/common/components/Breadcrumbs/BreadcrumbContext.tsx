import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/router";

interface BreadcrumbContextType {
  breadcrumbs: Record<string, string>;
  setCurrentBreadcrumbLabel: (label: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<Record<string, string>>({});
  const router = useRouter();

  const setCurrentBreadcrumbLabel = (label: string) => {
    const currentPath = router.asPath;
    setBreadcrumbs((prev) => ({ ...prev, [currentPath]: label }));
  };

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setCurrentBreadcrumbLabel }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb(): BreadcrumbContextType {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}
