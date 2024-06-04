import {
  LazyQueryHookOptions,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { useEffect, useState } from "react";
import { useMockLazyQuery } from "./mock-use-lazy-query";

type LazyQueryExecutor = (options?: LazyQueryOptions) => void;

interface LazyQueryOptions {
  variables?: Record<string, any>;
}

interface LazyQueryState {
  data: any;
  loading: boolean;
  error: any;
}

interface MockLazyQueryOptions {
  variables?: any;
  mockData: any;
  mockError?: any;
}

export const useMockQuery = (
  query: DocumentNode | TypedDocumentNode<any | OperationVariables>,
  options: MockLazyQueryOptions,
): LazyQueryState => {
  const [executeQuery, { data, loading, error }] = useMockLazyQuery(
    query,
    options,
  );

  useEffect(() => {
    executeQuery();
  }, []);

  return { data, loading, error };
};
