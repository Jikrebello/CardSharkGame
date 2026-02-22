import { Loot, SlotType } from "../domain/data/data.types";

export type CardVisualClass =
  | "treasure"
  | "shark"
  | "shield"
  | "scrambler"
  | "jammer"
  | "unique-1"
  | "unique-2"
  | "unique-3"
  | "unique-4"
  | "unique-5"
  | "unique-6"
  | "unique-7";

export function slotToBaseVisual(slot: SlotType): CardVisualClass {
  return slot === "BOMB" ? "shark" : "treasure";
}

export function lootToVisual(loot: Loot): CardVisualClass {
  if (loot.kind === "JOKER") {
    if (loot.value === "SHIELD") return "shield";
    if (loot.value === "SCRAMBLER") return "scrambler";
    return "jammer";
  }

  switch (loot.value) {
    case 1:
      return "unique-1";
    case 2:
      return "unique-2";
    case 3:
      return "unique-3";
    case 4:
      return "unique-4";
    case 5:
      return "unique-5";
    case 6:
      return "unique-6";
    case 7:
      return "unique-7";
    default:
      return "treasure";
  }
}
