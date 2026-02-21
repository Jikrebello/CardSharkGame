import {
  DEFAULT_MAX_TURNS,
  JAMMER_DURATION_TURNS,
  SCRAMBLER_MAX_CHARGES,
} from "./data/data.consts";

import {
  type BankedResult,
  type GameOverCheck,
  type Side,
  type SlotType,
  type TurnResult,
} from "./data/data.types";

import { bankPoints, trophyTier } from "./data/data.funcs";
import { IRunState } from "./data/data.interfaces";

import { resolveBombFlip, resolveTreasureFlip } from "./gameResolvers";
import { makeGameOverResult } from "./gameResultFactories";
import { computePBomb } from "./gameRules";

export function newGame(maxTurns: number = DEFAULT_MAX_TURNS): IRunState {
  return {
    lives: 3,
    totalScore: 0,

    turnsLeft: maxTurns,
    maxTurns,

    streak: 0,
    uniques: new Set<number>(),

    hasShield: false,
    scramblerCharges: 0,
    jammerTurns: 0,

    leftSlot: "TREASURE",
    rightSlot: "TREASURE",
  };
}

export function checkGameOver(state: IRunState): GameOverCheck {
  if (state.lives <= 0) return { over: true, reason: "LIVES" };
  if (state.turnsLeft <= 0) return { over: true, reason: "TURNS" };
  return { over: false };
}

export function canBank(state: IRunState): boolean {
  return state.uniques.size > 0 && state.lives > 0 && state.turnsLeft > 0;
}

export function bank(state: IRunState): BankedResult {
  const uniqueCount = state.uniques.size;
  const points = bankPoints(uniqueCount);

  state.totalScore += points;
  state.lastEvent = `Banked ${points} points (u=${uniqueCount}).`;

  const tier = trophyTier(state.totalScore);

  resetRun(state);

  return {
    kind: "BANKED",
    points,
    totalScore: state.totalScore,
    trophyTier: tier,
  };
}

export function startNextTurn(state: IRunState): TurnResult {
  const over = checkGameOver(state);
  if (over.over) {
    return makeGameOverResult(state, over.reason);
  }

  const pBomb = computePBomb(state.streak, state.jammerTurns);

  if (state.jammerTurns > 0) {
    state.jammerTurns -= 1;
  }

  const bombPresent = Math.random() < pBomb;
  assignSlotsForTurn(state, bombPresent);

  state.lastEvent = `Turn ready. (Turns left: ${state.turnsLeft})`;
  return { kind: "READY" };
}

export function flip(state: IRunState, side: Side): TurnResult {
  const overBefore = checkGameOver(state);
  if (overBefore.over) {
    return makeGameOverResult(state, overBefore.reason);
  }

  state.turnsLeft -= 1;

  const slot = getSelectedSlot(state, side);

  if (slot === "BOMB") {
    return resolveBombFlip(state);
  }

  return resolveTreasureFlip(state);
}

export function applyJokerLoot(
  state: IRunState,
  joker: "SHIELD" | "SCRAMBLER" | "JAMMER",
): void {
  if (joker === "SHIELD") {
    if (!state.hasShield) {
      state.hasShield = true;
      state.lastEvent = "Loot: Shield acquired.";
      return;
    }

    state.scramblerCharges = Math.min(
      SCRAMBLER_MAX_CHARGES,
      state.scramblerCharges + 1,
    );
    state.lastEvent =
      "Loot: Shield (already had one) converted to +1 scrambler charge.";
    return;
  }

  if (joker === "SCRAMBLER") {
    state.scramblerCharges = Math.min(
      SCRAMBLER_MAX_CHARGES,
      state.scramblerCharges + 2,
    );
    state.lastEvent = "Loot: Scrambler (+2 charges).";
    return;
  }

  // JAMMER
  state.jammerTurns = JAMMER_DURATION_TURNS;
  state.lastEvent = "Loot: Jammer (bomb chance reduced for 3 turns).";
}

export function resetRun(state: IRunState): void {
  state.streak = 0;
  state.uniques = new Set<number>();
  state.hasShield = false;
  state.scramblerCharges = 0;
  state.jammerTurns = 0;
}

export function assignSlotsForTurn(
  state: IRunState,
  bombPresent: boolean,
): void {
  const slots: SlotType[] = bombPresent
    ? ["BOMB", "TREASURE"]
    : ["TREASURE", "TREASURE"];

  if (Math.random() < 0.5) {
    state.leftSlot = slots[0];
    state.rightSlot = slots[1];
    return;
  }

  state.leftSlot = slots[1];
  state.rightSlot = slots[0];
}

export function getSelectedSlot(state: IRunState, side: Side): SlotType {
  return side === "LEFT" ? state.leftSlot : state.rightSlot;
}
