import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from as apolloFrom,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: process.env.NEXT_PUBLIC_REQUEST_CREDENTIALS,
  headers: {
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

const client = new ApolloClient({
  link: apolloFrom([authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: "cache-and-network",
    },
  },
});

export default client;
