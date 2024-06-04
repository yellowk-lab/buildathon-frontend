import { useEffect, useState } from "react";
import {
  useQuery,
  OperationVariables,
  DocumentNode,
  gql,
} from "@apollo/client";
import { useBreadcrumb } from "./BreadcrumbContext";

interface BreadcrumbQueryOptions<
  TData = any,
  TVariables extends OperationVariables = {}
> {
  query: DocumentNode;
  variables?: TVariables;
  resolver: (data: TData) => string;
}

export function useBreadcrumbWithQuery<
  TData,
  TVariables extends OperationVariables
>() {
  const { setCurrentBreadcrumbLabel } = useBreadcrumb();

  const [queryOptions, setQueryOptions] = useState<BreadcrumbQueryOptions<
    TData,
    TVariables
  > | null>(null);

  const { data } = useQuery<TData, TVariables>(queryOptions?.query || gql``, {
    variables: queryOptions?.variables,
    skip: !queryOptions,
  });

  useEffect(() => {
    if (data && queryOptions) {
      const label = queryOptions.resolver(data);
      setCurrentBreadcrumbLabel(label);
    }
  }, [data, setCurrentBreadcrumbLabel, queryOptions]);

  return {
    setWithQuery: (options: BreadcrumbQueryOptions<TData, TVariables>) =>
      setQueryOptions(options),
  };
}
