import { gql } from "@apollo/client";

export const GET_LOOT_BOXES_BY_USER = gql`
  query GetLootBoxesByUser($emailOrWallet: String!) {
    lootBoxes(emailOrWallet: $emailOrWallet) {
      lootNftId
      lootClaimed
      lootRedeemed
      loot {
        imageUrl
        name
      }
    }
  }
`;
