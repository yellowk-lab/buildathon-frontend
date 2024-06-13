import { gql } from "@apollo/client";

export const FETCH_PRIZE_CAISSETTE = gql`
    query FetchPrizeCaissette($hash: String!) {
        openCaissette(hash: $hash) {
            id
            type
            description
            amount
        }
    }
`;

export const FETCH_METADATA = gql`
    query FetchMetaData($tokenId: String!) {
        getNFTMetadata(tokenId: $tokenId) {
            id
            image
            name
            description
        }
    }
`;

export const GET_CAISSETTES_WITH_ONGOING_LOOT_BOXES = gql`
    query GetCaissettesWithOngoingEventLootBoxes {
        caissettes {
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
