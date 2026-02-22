import {
  IGameUIAnimations,
  IGameUIDomElements,
  IRunState,
} from "../domain/data/data.interfaces";
import { Loot, Side, SlotType, TurnResult } from "../domain/data/data.types";

type CardVisualClass =
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

const ALL_CARD_VISUAL_CLASSES: CardVisualClass[] = [
  "treasure",
  "shark",
  "shield",
  "scrambler",
  "jammer",
  "unique-1",
  "unique-2",
  "unique-3",
  "unique-4",
  "unique-5",
  "unique-6",
  "unique-7",
];

function slotToVisual(slot: SlotType): CardVisualClass {
  return slot === "BOMB" ? "shark" : "treasure";
}

function lootToVisual(loot: Loot): CardVisualClass {
  if (loot.kind === "JOKER") {
    switch (loot.value) {
      case "SHIELD":
        return "shield";
      case "SCRAMBLER":
        return "scrambler";
      case "JAMMER":
        return "jammer";
      default:
        return "treasure";
    }
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

function applyCardVisualClass(
  card: HTMLButtonElement,
  visual: CardVisualClass,
): void {
  card.classList.remove(...ALL_CARD_VISUAL_CLASSES);
  card.classList.add(visual);
}

export function createAnimations(
  dom: IGameUIDomElements,
  setInputLocked: (lock: boolean) => void,
): IGameUIAnimations {
  function lockInput(lock: boolean) {
    setInputLocked(lock);

    if (lock) {
      dom.cardLeft.classList.add("disabled");
      dom.cardRight.classList.add("disabled");
      dom.cardLeft.disabled = true;
      dom.cardRight.disabled = true;
      dom.btnBank.disabled = true;
      return;
    }

    dom.cardLeft.classList.remove("disabled");
    dom.cardRight.classList.remove("disabled");
    dom.cardLeft.disabled = false;
    dom.cardRight.disabled = false;
  }

  function resetCards() {
    for (const card of [dom.cardLeft, dom.cardRight]) {
      card.classList.remove(
        "selected",
        "revealed",
        "win",
        "lose",
        "treasure",
        "bomb", // legacy cleanup if old class is ever still applied
        "shark",
        "shield",
        "scrambler",
        "jammer",
        "unique-1",
        "unique-2",
        "unique-3",
        "unique-4",
        "unique-5",
        "unique-6",
        "unique-7",
      );
    }
  }

  function revealBoth(
    state: IRunState,
    chosen: Side,
    chosenSlot: SlotType,
    result: TurnResult,
  ) {
    // Base visuals for both cards by slot
    applyCardVisualClass(dom.cardLeft, slotToVisual(state.leftSlot));
    applyCardVisualClass(dom.cardRight, slotToVisual(state.rightSlot));

    // Upgrade chosen treasure card to exact card art (joker or unique number)
    if (chosenSlot === "TREASURE" && result.kind === "TREASURE") {
      const chosenCard = chosen === "LEFT" ? dom.cardLeft : dom.cardRight;
      applyCardVisualClass(chosenCard, lootToVisual(result.loot));
    }

    dom.cardLeft.classList.add("revealed");
    dom.cardRight.classList.add("revealed");

    const chosenCard = chosen === "LEFT" ? dom.cardLeft : dom.cardRight;
    chosenCard.classList.add("selected");
    chosenCard.classList.add(chosenSlot === "TREASURE" ? "win" : "lose");
  }

  return {
    lockInput,
    resetCards,
    revealBoth,
  };
}
