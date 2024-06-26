import { gql } from "@apollo/client";

export const REDEEM_LOOT = gql`
  mutation RedeemLoot($input: RedeemLootInput!) {
    redeemLoot(input: $input) {
      id
      # trackingNumber
    }
  }
`;
