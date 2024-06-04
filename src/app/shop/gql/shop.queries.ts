import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    productsCollection {
      edges {
        node {
          id
          title
          image_url
          price_in_tokens
          stock
          initial_stock
        }
      }
    }
  }
`;
