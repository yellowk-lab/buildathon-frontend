import {
  LazyQueryHookOptions,
  MutationHookOptions,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { useState } from "react";

type LazyQueryExecutor = (options?: LazyQueryOptions) => void;

interface LazyQueryOptions {
  variables?: Record<string, any>;
}

interface LazyQueryState {
  data: any;
  loading: boolean;
  error: any;
}

interface MockLazyQueryOptions extends MutationHookOptions {
  variables?: any;
  mockData: any;
  mockError?: any;
}

export const useMockLazyQuery = (
  query: DocumentNode | TypedDocumentNode<any | OperationVariables>,
  options: MockLazyQueryOptions,
): [LazyQueryExecutor, LazyQueryState] => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = (execOptions?: LazyQueryHookOptions) => {
    setLoading(true);

    setTimeout(() => {
      console.log(`Mock execution of query: `, query);
      console.log(
        "with variables: ",
        execOptions?.variables || options.variables,
      );
      if (options.mockError) {
        setError(options.mockError);
      } else {
        setData(options.mockData);
      }
      setLoading(false);
    }, 1000);
  };

  return [executeQuery, { data, loading, error }];
};
