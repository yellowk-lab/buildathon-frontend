import { Location } from "./location";
import { Loot } from "./loot";

export type LootBox = {
  id?: string;
  lootClaimed: boolean;
  lootRedeemed: boolean;
  lootNftId: string;
  location?: Location;
  loot: Loot;
};
