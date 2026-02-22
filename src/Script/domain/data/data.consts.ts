import { TrophyTier, UniqueNumber } from "./data.types";

export const SCRAMBLER_MAX_CHARGES = 4;
export const JAMMER_DURATION_TURNS = 3;

export const LIVES_TOTAL = 3;

export const DEFAULT_MAX_TURNS = 40;

export const FLIP_REVEAL_TIME = 1000;

export const TROPHY_THRESHOLDS = {
  bronze: 100,
  silver: 150,
  gold: 230,
} as const;

export const TROPHY_ROT = new BABYLON.Vector3(0, 0, 0);

export const TARGET_TROPHY_HEIGHT = 2.6;
export const TROPHY_STAGE_TARGET = new BABYLON.Vector3(0, -0.15, 0);
export const TROPHY_BASE_POS = new BABYLON.Vector3(-1.35, -1.05, 0);
export const TROPHY_STAGE_CAMERA_TARGET = new BABYLON.Vector3(-1.5, 0.25, 0);

export const TEXTURE_PATHS: Record<Exclude<TrophyTier, "NONE">, string> = {
  BRONZE: "./Textures/Trophy/trophy_bronze.webp",
  SILVER: "./Textures/Trophy/trophy_silver.webp",
  GOLD: "./Textures/Trophy/trophy_gold.webp",
};

export const UNIQUE_LABELS_SHORT: Record<UniqueNumber, string> = {
  1: "Ruby",
  2: "Diamond",
  3: "Emerald",
  4: "Citrine",
  5: "Ring",
  6: "Crown",
  7: "Coins",
};

export const UNIQUE_LABELS_LONG: Record<UniqueNumber, string> = {
  1: "Ruby",
  2: "Diamond",
  3: "Emerald",
  4: "Citrine",
  5: "Ring",
  6: "Crown",
  7: "Gold Coins",
};
