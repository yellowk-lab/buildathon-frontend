import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation createReview($input: [reviewInsertInput!]!) {
    insertIntoreviewCollection(objects: $input) {
      records {
        id
        content
        articleId
        pointsEarned
      }
    }
  }
`;
