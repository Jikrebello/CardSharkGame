import { TROPHY_THRESHOLDS } from "./data.consts";
import { IRunState, IUiMessage } from "./data.interfaces";
import { Side, SlotType, TrophyTier, TurnResult } from "./data.types";

export function bankPoints(uniqueCount: number): number {
  switch (uniqueCount) {
    case 1:
      return 1;
    case 2:
      return 5;
    case 3:
      return 20;
    case 4:
      return 40;
    case 5:
      return 80;
    case 6:
      return 110;
    case 7:
      return 150;
    default:
      return 0;
  }
}

export function trophyTier(totalScore: number): TrophyTier {
  if (totalScore >= TROPHY_THRESHOLDS.gold) return "GOLD";
  if (totalScore >= TROPHY_THRESHOLDS.silver) return "SILVER";
  if (totalScore >= TROPHY_THRESHOLDS.bronze) return "BRONZE";
  return "NONE";
}

export function getFlipMessage(result: TurnResult): IUiMessage | null {
  if (result.kind === "BOMB_HIT") {
    return {
      title: "Boom.",
      body: result.shieldSaved
        ? "Shield saved you. Streak reset."
        : "Lost a life.",
    };
  }

  if (result.kind === "TREASURE") {
    if (result.duplicateBusted) {
      return {
        title: "Run busted.",
        body: "Duplicate ended your run.",
      };
    }

    if (result.loot.kind === "NUMBER") {
      return {
        title: "Treasure!",
        body: `Loot: ${result.loot.value}`,
      };
    }

    return {
      title: "Joker!",
      body: `Loot: ${result.loot.value}`,
    };
  }

  return null;
}

export function getChosenSlot(state: IRunState, side: Side): SlotType {
  return side === "LEFT" ? state.leftSlot : state.rightSlot;
}

export function isFlipTerminal(result: TurnResult): boolean {
  return (
    (result.kind === "BOMB_HIT" && result.gameOver) ||
    (result.kind === "TREASURE" && result.gameOver) ||
    result.kind === "GAME_OVER"
  );
}
