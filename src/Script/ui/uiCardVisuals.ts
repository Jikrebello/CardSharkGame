import { SlotType } from "../domain/data/data.types";

export type CardVisualClass = "treasure" | "bomb";

const ALL_CARD_VISUAL_CLASSES: CardVisualClass[] = ["treasure", "bomb"];

export function clearCardVisualClasses(card: HTMLButtonElement): void {
  card.classList.remove(...ALL_CARD_VISUAL_CLASSES);
}

export function applySlotVisualClass(
  card: HTMLButtonElement,
  slot: SlotType,
): void {
  clearCardVisualClasses(card);
  card.classList.add(slot === "TREASURE" ? "treasure" : "bomb");
}
