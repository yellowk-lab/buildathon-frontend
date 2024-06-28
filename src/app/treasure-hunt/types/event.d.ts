import { LootBox } from "./loot-box";

export type Event = {
  id: string;
  name: string;
  brand: string;
  status: string;
  description?: string;
  lootClaimed: boolean;
  lootBoxes?: LootBox[];
};
