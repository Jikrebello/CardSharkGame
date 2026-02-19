export type SlotType = "TREASURE" | "BOMB";

export type JokerType = "SHIELD" | "SCRAMBLER" | "JAMMER";
export type Loot =
  | { kind: "NUMBER"; value: number } // 1..7
  | { kind: "JOKER"; value: JokerType };

export interface RunState {
  // Run/Session meta
  lives: number; // 3 at game start
  totalScore: number; // carry-over banked score

  // Turn limit
  turnsLeft: number; // decremented on each FLIP
  maxTurns: number; // for UI (progress bars, etc.)

  // Current run (cleared on run reset)
  streak: number; // consecutive treasure flips this run
  uniques: Set<number>; // numbers collected this run

  // Jokers / modifiers (cleared on run reset unless stated otherwise)
  hasShield: boolean; // max 1
  scramblerCharges: number; // rerolls to avoid duplicates
  jammerTurns: number; // turns remaining to reduce bomb appearance (decrements each turn start)

  // Current turn slots
  leftSlot: SlotType;
  rightSlot: SlotType;

  // optional: last event text for UI
  lastEvent?: string;
}

export const DEFAULT_MAX_TURNS = 40;

export const TROPHY_THRESHOLDS = {
  bronze: 80,
  silver: 150,
  gold: 230,
} as const;

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
      return 150; // 70 + 30 full-set bonus
    default:
      return 0;
  }
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
