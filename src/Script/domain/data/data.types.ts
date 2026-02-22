export type SlotType = "TREASURE" | "BOMB";
export type Side = "LEFT" | "RIGHT";

export type JokerType = "SHIELD" | "SCRAMBLER" | "JAMMER";

export type GameOverCheck =
  | { over: true; reason: GameOverReason }
  | { over: false };

export type TreasureResult = Extract<TurnResult, { kind: "TREASURE" }>;
export type BombHitResult = Extract<TurnResult, { kind: "BOMB_HIT" }>;
export type BankedResult = Extract<TurnResult, { kind: "BANKED" }>;
export type GameOverResult = Extract<TurnResult, { kind: "GAME_OVER" }>;

export type Loot =
  | { kind: "NUMBER"; value: number }
  | { kind: "JOKER"; value: JokerType };

export type TrophyTier = "NONE" | "BRONZE" | "SILVER" | "GOLD";
export type GameOverReason = "LIVES" | "TURNS";

export type TurnResult =
  | { kind: "READY" }
  | {
      kind: "TREASURE";
      loot: Loot;
      duplicateBusted: boolean;
      shieldSaved: boolean;
      gameOver: boolean;
      turnsLeft: number;
    }
  | {
      kind: "BOMB_HIT";
      shieldSaved: boolean;
      gameOver: boolean;
      reason?: GameOverReason;
      turnsLeft: number;
    }
  | {
      kind: "BANKED";
      points: number;
      totalScore: number;
      trophyTier: TrophyTier;
    }
  | {
      kind: "GAME_OVER";
      reason: GameOverReason;
      totalScore: number;
      trophyTier: TrophyTier;
    };

export type TrophyAssets = {
  root: BABYLON.TransformNode;
  meshes: BABYLON.AbstractMesh[];
  particle?: BABYLON.ParticleSystem;
  sparkleEmitter?: BABYLON.AbstractMesh;
};
export type UniqueNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
