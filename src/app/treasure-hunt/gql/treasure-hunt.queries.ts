import { gql } from "@apollo/client";

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
        name
        imageUrl
      }
    }
  }
`;
