import { IRunState } from "./data/data.interfaces";
import {
  BombHitResult,
  GameOverReason,
  TreasureResult,
  TurnResult,
} from "./data/data.types";
import { makeBombHitResult, makeTreasureResult } from "./gameResultFactories";
import { drawLoot, rollNumber1to7 } from "./gameRules";
import {
  applyJokerLoot,
  checkGameOver,
  resetRun,
} from "./gameStateTransitions";

export function resolveBombFlip(state: IRunState): BombHitResult {
  if (state.hasShield) {
    state.hasShield = false;
    state.streak = 0;
    state.lastEvent = "Bomb hit, shield saved you. Streak reset.";

    return makeBombHitResult(state, {
      shieldSaved: true,
    });
  }

  state.lives -= 1;

  const over = checkGameOver(state);
  state.lastEvent = over.over
    ? "Bomb hit. Game over."
    : "Bomb hit. Lost a life. Run reset.";

  resetRun(state);

  return makeBombHitResult(state, {
    shieldSaved: false,
  });
}

export function resolveTreasureFlip(state: IRunState): TreasureResult {
  state.streak += 1;

  const loot = drawLoot();

  if (loot.kind === "JOKER") {
    applyJokerLoot(state, loot.value);
    return makeTreasureResult(state, loot, {
      duplicateBusted: false,
      shieldSaved: false,
    });
  }

  return resolveNumberLoot(state, loot.value);
}

export function resolveNumberLoot(
  state: IRunState,
  value: number,
): TreasureResult {
  const isDuplicate = state.uniques.has(value);

  if (!isDuplicate) {
    state.uniques.add(value);
    state.lastEvent = `Loot: Number ${value} (new).`;

    return makeTreasureResult(
      state,
      { kind: "NUMBER", value },
      {
        duplicateBusted: false,
        shieldSaved: false,
      },
    );
  }

  if (state.hasShield) {
    state.hasShield = false;
    state.lastEvent = `Loot: Number ${value} duplicate, shield saved you.`;

    return makeTreasureResult(
      state,
      { kind: "NUMBER", value },
      {
        duplicateBusted: false,
        shieldSaved: true,
      },
    );
  }

  if (state.scramblerCharges > 0) {
    return resolveDuplicateWithScrambler(state, value);
  }

  state.lastEvent = `Loot: Number ${value} duplicate. Run bust.`;
  resetRun(state);

  return makeTreasureResult(
    state,
    { kind: "NUMBER", value },
    {
      duplicateBusted: true,
      shieldSaved: false,
    },
  );
}

export function resolveDuplicateWithScrambler(
  state: IRunState,
  duplicateValue: number,
): TreasureResult {
  state.scramblerCharges -= 1;

  const reroll = rollNumber1to7();

  if (!state.uniques.has(reroll)) {
    state.uniques.add(reroll);
    state.lastEvent = `Loot: Duplicate ${duplicateValue}, scrambler rerolled to ${reroll} (new).`;

    return makeTreasureResult(
      state,
      { kind: "NUMBER", value: reroll },
      { duplicateBusted: false, shieldSaved: false },
    );
  }

  state.lastEvent = `Loot: Duplicate ${duplicateValue}, scrambler reroll also duplicate (${reroll}). Run bust.`;
  resetRun(state);

  return makeTreasureResult(
    state,
    { kind: "NUMBER", value: duplicateValue },
    { duplicateBusted: true, shieldSaved: false },
  );
}

export function resolveGameOverReasonAfterFlip(
  state: IRunState,
  result: TurnResult,
): GameOverReason {
  if (result.kind === "GAME_OVER") {
    return result.reason;
  }

  if (result.kind === "BOMB_HIT" && result.reason) {
    return result.reason;
  }

  return state.lives <= 0 ? "LIVES" : "TURNS";
}
