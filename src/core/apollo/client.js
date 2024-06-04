import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  from as apolloFrom,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import { createClient as createWsClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import WebSocket from "ws";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: process.env.NEXT_PUBLIC_REQUEST_CREDENTIALS,
  headers: {
    apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  },
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    headers,
  };
});

const wsImpl = typeof window === "undefined" ? WebSocket : undefined;
const wsLink = new GraphQLWsLink(
  createWsClient({
    url: process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL,
    webSocketImpl: wsImpl,
  })
);

const directionalLink = split(
  (operation) => {
    const definition = getMainDefinition(operation.query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: apolloFrom([directionalLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: "cache-and-network",
    },
  },
});

export default client;
