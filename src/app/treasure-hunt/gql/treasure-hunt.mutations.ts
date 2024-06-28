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

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: ChangeEventStatusInput!, $password: String!) {
    changeEventStatus(input: $input, password: $password) {
      id
      name
      brand
      description
      status
    }
  }
`;
