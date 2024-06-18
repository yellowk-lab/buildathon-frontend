import { LootBox } from "./loot-box";

export type Location = {
  id: string;
  longitude: number;
  latitude: number;
  address?: string;
  positionName?: string;
};
