import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

export enum ApolloServerErrorCode {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  GRAPHQL_PARSE_FAILED = "GRAPHQL_PARSE_FAILED",
  GRAPHQL_VALIDATION_FAILED = "GRAPHQL_VALIDATION_FAILED",
  PERSISTED_QUERY_NOT_FOUND = "PERSISTED_QUERY_NOT_FOUND",
  PERSISTED_QUERY_NOT_SUPPORTED = "PERSISTED_QUERY_NOT_SUPPORTED",
  BAD_USER_INPUT = "BAD_USER_INPUT",
  OPERATION_RESOLUTION_FAILURE = "OPERATION_RESOLUTION_FAILURE",
  BAD_REQUEST = "BAD_REQUEST",
}

export class BaseError {
  static SERVER_CODES = ApolloServerErrorCode;
  context: ApolloError;

  constructor(context: unknown) {
    if (!this.isApolloError(context)) {
      throw new Error("The provided error is not an ApolloError");
    }
    this.context = context as ApolloError;
  }

  static createContext(
    code: string = BaseError.SERVER_CODES.INTERNAL_SERVER_ERROR,
    message: string = "Internal server error",
    options?: Record<string, any>,
  ) {
    const baseGraphQLError = new GraphQLError(message, {
      extensions: {
        code: code,
        ...options,
      },
    });
    const context = new ApolloError({
      graphQLErrors: [baseGraphQLError],
    });
    return new BaseError(context);
  }

  is(code: string): boolean {
    for (let i = 0; i < this.context.graphQLErrors.length; i++) {
      const graphQLError = this.context.graphQLErrors[i];
      if (graphQLError.extensions.code === code) {
        return true;
      }
    }
    return false;
  }

  isApolloError(error: any): error is ApolloError {
    return (
      error instanceof ApolloError ||
      (error.graphQLErrors && error.graphQLErrors[0]?.extensions)
    );
  }
}
