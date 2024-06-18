import { Location } from "./location";

export type LootBox = {
  id?: string;
  lootClaimed: boolean;
  location?: Location;
};
