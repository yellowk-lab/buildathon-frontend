import { gql } from "@apollo/client";

export const SCAN_LOOT_BOX_QR = gql`
  mutation ScanLootBoxQR($input: ScanQRCodeInput!) {
    scanLootBoxQRCode(scanInput: $input) {
      id
      isOpened
      dateOpened
      lootId
      openedById
      eventId
      qrCodeId
    }
  }
`;

export const CLAIM_LOOT_BOX = gql`
  mutation ClaimLootBox($input: ClaimLootBoxInput!) {
    claimLootBox(claimInput: $input) {
      id
      isOpened
      dateOpened
      lootId
      openedById
      eventId
      qrCodeId
    }
  }
`;

export const PRIZE_DRAW_REGISTRATION = gql`
  mutation PrizeDrawRegistration($email: String!) {
    prizeDrawRegistration(email: $email) {
      id
      email
    }
  }
`;
