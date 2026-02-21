import { clamp } from "../shared/clamp";
import { JokerType, Loot } from "./data/data.types";

export function getBombProbability(
  streak: number,
  jammerTurns: number,
): number {
  // Base 20%, +6% per streak, capped at 56%; jammer reduces by 15%
  let p = clamp(0.2 + 0.06 * streak, 0.2, 0.56);
  if (jammerTurns > 0) p = Math.max(0, p - 0.15);
  return p;
}

export function drawLoot(): Loot {
  const jokerRoll = Math.random() < 0.15;

  if (jokerRoll) {
    const jokers: JokerType[] = ["SHIELD", "SCRAMBLER", "JAMMER"];
    const j = jokers[Math.floor(Math.random() * jokers.length)];
    return { kind: "JOKER", value: j };
  }

  const n = 1 + Math.floor(Math.random() * 7);
  return { kind: "NUMBER", value: n };
}

export function rollNumber1to7(): number {
  return 1 + Math.floor(Math.random() * 7);
}
