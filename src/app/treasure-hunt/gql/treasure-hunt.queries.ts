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

export const GET_CAISSETTES_WITH_ONGOING_LOOT_BOXES = gql`
  query GetCaissettesWithOngoingEventLootBoxes {
    crates {
      id
      latitude
      longitude
      address
      positionName
      qrCode {
        id
        lootBoxes {
          isOpened
        }
      }
    }
  }
`;

export const GET_TOTAL_UNCLAIMED_LOOTS = gql`
  query GetTotalUnclaimedLoots {
    totalUnclaimedLoots
  }
`;

export const GET_PRIZE_LIST = gql`
  query GetPrizeList {
    loots {
      id
      name
      displayName
      totalSupply
      circulatingSupply
      claimedSupply
    }
  }
`;

export const GET_LOOT_BOX_BY_HASH = gql`
  query GetLootBoxByHash($hash: String!) {
    lootBoxByHash(hash: $hash) {
      id
      isOpened
      dateOpened
      lootId
      openedById
      eventId
      qrCodeId
      loot {
        id
        name
        displayName
        totalSupply
        circulatingSupply
        claimedSupply
      }
    }
  }
`;

export const GET_UPCOMING_EVENT = gql`
  query GetUpcomingEvent {
    upcomingEvent {
      startDate
    }
  }
`;
