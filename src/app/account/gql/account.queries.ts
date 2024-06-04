import { gql } from "@apollo/client";

export const GET_ACCOUNT_DETAILS = gql`
  query GetAccountDetails($userId: String!) {
    getuserinfo(userid: $userId) {
      id
      pointsAvailable
    }
  }
`;

export const GET_GIFTS_LIST = gql`
  query GetArticleById($id: UUID!) {
    articlesCollection(filter: { id: { in: $id } }) {
      edges {
        node {
          title
        }
      }
    }
  }
`;
