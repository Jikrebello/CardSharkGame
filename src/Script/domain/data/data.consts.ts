import { TrophyTier } from "./data.types";

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
