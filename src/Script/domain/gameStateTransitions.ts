import { IRunState } from "./data/data.interfaces";
import { Side, SlotType, TurnResult } from "./data/data.types";

export function newGame(): IRunState {
  return {
    streak: 0,
    leftSlot: "TREASURE",
    rightSlot: "BOMB",
    lastEvent: "Game started.",
  };
}

export function startNextTurn(state: IRunState): TurnResult {
  assignSlotsForTurn(state);
  state.lastEvent = "Pick a card.";
  return { kind: "READY" };
}

export function flip(state: IRunState, side: Side): TurnResult {
  const slot = getCurrentSlot(state, side);

  if (slot === "BOMB") {
    state.streak = 0;
    state.lastEvent = "Boom! Wrong card. Streak reset.";
    return { kind: "LOSE" };
  }

  state.streak += 1;
  state.lastEvent = "Treasure found!";
  return { kind: "WIN" };
}

export function assignSlotsForTurn(state: IRunState): void {
  if (Math.random() < 0.5) {
    state.leftSlot = "TREASURE";
    state.rightSlot = "BOMB";
  } else {
    state.leftSlot = "BOMB";
    state.rightSlot = "TREASURE";
  }
}

export function getCurrentSlot(state: IRunState, side: Side): SlotType {
  return side === "LEFT" ? state.leftSlot : state.rightSlot;
}
