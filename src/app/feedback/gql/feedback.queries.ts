import { gql } from "@apollo/client";

export const SEARCH_ARTICLES_BY_TITLE = gql`
  query SearchArticleByTitle($title: String!) {
    getArticlesByTitle(searchTitle: $title) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
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

export const GET_EARNED_POINTS = gql`
  query GetUserEarnedPoint($userId: UUID!, $articleId: UUID!) {
    getearnedpoints(accountuserid: $userId, articleid: $articleId) {
      earnedPoints
    }
  }
`;
