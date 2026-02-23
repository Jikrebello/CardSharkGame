export type SlotType = "TREASURE" | "BOMB";
export type Side = "LEFT" | "RIGHT";

export type TurnResult = { kind: "READY" } | { kind: "WIN" } | { kind: "LOSE" };

export type TrophyTier = "NONE" | "BRONZE" | "SILVER" | "GOLD";

export type TrophyAssets = {
  root: BABYLON.TransformNode;
  meshes: BABYLON.AbstractMesh[];
  particle?: BABYLON.ParticleSystem;
  sparkleEmitter?: BABYLON.AbstractMesh;
};
