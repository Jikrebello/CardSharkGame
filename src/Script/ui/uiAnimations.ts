import {
  IGameUI_DOM_Elements,
  IGameUIAnimations,
  IRunState,
} from "../domain/data/data.interfaces";
import { Side, SlotType } from "../domain/data/data.types";

function applySlotClass(card: HTMLButtonElement, slot: SlotType) {
  card.classList.remove("treasure", "bomb");
  card.classList.add(slot === "TREASURE" ? "treasure" : "bomb");
}

export function createAnimations(
  dom: IGameUI_DOM_Elements,
  setInputLocked: (lock: boolean) => void,
): IGameUIAnimations {
  function lockInput(lock: boolean) {
    setInputLocked(lock);

    if (lock) {
      dom.cardLeft.classList.add("disabled");
      dom.cardRight.classList.add("disabled");
      dom.cardLeft.disabled = true;
      dom.cardRight.disabled = true;
      dom.btnBank.disabled = true; // render() may re-enable later
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
        "bomb",
      );
    }
  }

  function revealBoth(state: IRunState, chosen: Side, chosenSlot: SlotType) {
    applySlotClass(dom.cardLeft, state.leftSlot);
    applySlotClass(dom.cardRight, state.rightSlot);

    dom.cardLeft.classList.add("revealed");
    dom.cardRight.classList.add("revealed");

    const chosenCard = chosen === "LEFT" ? dom.cardLeft : dom.cardRight;
    chosenCard.classList.add("selected");
    chosenCard.classList.add(chosenSlot === "TREASURE" ? "win" : "lose");
  }

  function hideGameOver() {
    dom.gameOver.classList.add("hidden");
  }

  function showGameOverOverlay() {
    dom.gameOver.classList.remove("hidden");
  }

  return {
    lockInput,
    resetCards,
    revealBoth,
    hideGameOver,
    showGameOverOverlay,
  };
}
