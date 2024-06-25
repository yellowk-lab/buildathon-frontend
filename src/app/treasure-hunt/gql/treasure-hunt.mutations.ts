import { gql } from "@apollo/client";

export const ASSIGN_LOCATION_TO_LOOT_BOX = gql`
  mutation assignLocationToLootBox($input: ScanLootBoxInput!) {
    assignLocationToLootBox(input: $input) {
      location {
        id
      }
    }
  }
`;

export const CLAIM_LOOT_BOX = gql`
  mutation claimLootBox($input: ClaimLootBoxInput!) {
    claimLootBox(input: $input) {
      lootClaimed
    }
  }
`;
