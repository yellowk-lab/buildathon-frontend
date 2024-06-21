import { gql } from "@apollo/client";

// LEGACY ENDPOINTS
export const GET_EARNED_POINTS = gql`
  query GetUserEarnedPoint($userId: UUID!, $articleId: UUID!) {
    getearnedpoints(accountuserid: $userId, articleid: $articleId) {
      earnedPoints
    }
  }
`;

export const GET_CRATES_WITH_ONGOING_LOOT_BOXES = gql`
  query GetCratesWithOngoingEventLootBoxes {
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

// END LEGACY ENDPOINTS

export const GET_ACTIVE_EVENTS = gql`
  query GetActiveEvents {
    events {
      id
      lootBoxes {
        lootClaimed
        loot {
          imageUrl
        }
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

export const GET_EVENT_STATUS_OF_LOOT_BOX = gql`
  query GetEventStatus($lootBoxId: String!) {
    lootbox(id: $lootBoxId) {
      event {
        status
      }
    }
  }
`;

export const SCAN_LOOT_BOX = gql`
  query ScanLootBox($input: ScanLootBoxInput!) {
    scanLootBox(input: $input) {
      lootClaimed
      loot {
        id
        displayName
        imageUrl
      }
    }
  }
`;
