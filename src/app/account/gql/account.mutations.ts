import { gql } from "@apollo/client";

export const X = gql`
  mutation x($input: Input!) {
    x(input: $input) {
      
    }
  }
`;
