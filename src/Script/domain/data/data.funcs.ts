import type { IRunState, IUiMessage } from "./data.interfaces";
import type { Side, SlotType, TrophyTier, TurnResult } from "./data.types";

export function getChosenSlot(state: IRunState, side: Side): SlotType {
  return side === "LEFT" ? state.leftSlot : state.rightSlot;
}

export function getFlipMessage(result: TurnResult): IUiMessage | null {
  switch (result.kind) {
    case "WIN":
      return {
        title: "Treasure!",
        body: "Nice pick — your streak increased.",
      };

    case "LOSE":
      return {
        title: "Boom!",
        body: "You hit the bomb. Streak reset.",
      };

    case "READY":
    default:
      return null;
  }
}

export function isFlipTerminal(result: TurnResult): boolean {
  return result.kind === "WIN" || result.kind === "LOSE";
}

export function trophyTier(scoreOrStreak: number): TrophyTier {
  if (scoreOrStreak <= 0) return "NONE";
  return "BRONZE";
}
