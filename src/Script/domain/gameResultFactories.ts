import { trophyTier } from "./data/data.funcs";
import { IRunState } from "./data/data.interfaces";
import {
  BombHitResult,
  GameOverReason,
  GameOverResult,
  Loot,
  TreasureResult,
} from "./data/data.types";
import { checkGameOver } from "./gameStateTransitions";

export function makeGameOverResult(
  state: IRunState,
  reason: GameOverReason,
): GameOverResult {
  return {
    kind: "GAME_OVER",
    reason,
    totalScore: state.totalScore,
    trophyTier: trophyTier(state.totalScore),
  };
}

export function makeBombHitResult(
  state: IRunState,
  args: { shieldSaved: boolean },
): BombHitResult {
  const over = checkGameOver(state);

  return {
    kind: "BOMB_HIT",
    shieldSaved: args.shieldSaved,
    gameOver: over.over,
    reason: over.over ? over.reason : undefined,
    turnsLeft: state.turnsLeft,
  };
}

export function makeTreasureResult(
  state: IRunState,
  loot: Loot,
  args: {
    duplicateBusted: boolean;
    shieldSaved: boolean;
  },
): TreasureResult {
  const over = checkGameOver(state);

  return {
    kind: "TREASURE",
    loot,
    duplicateBusted: args.duplicateBusted,
    shieldSaved: args.shieldSaved,
    gameOver: over.over,
    turnsLeft: state.turnsLeft,
  };
}
