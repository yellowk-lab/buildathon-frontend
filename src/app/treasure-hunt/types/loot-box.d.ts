import { Location } from "./location";
import { Loot } from "./loot";

export type LootBox = {
  id?: string;
  lootClaimed: boolean;
  location?: Location;
  loot: Loot;
};
