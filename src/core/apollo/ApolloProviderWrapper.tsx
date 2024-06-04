import React, { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "@core/apollo";

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({
  children,
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
