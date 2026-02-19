import * as GC from "./gameController";
import type { RunState, SlotType } from "./gameState";

type Side = "LEFT" | "RIGHT";

export interface UIBindings {
  init(): void;
  render(state: RunState): void;
  setMessage(title: string, body?: string): void;
  lockInput(lock: boolean): void;
  revealBoth(state: RunState, chosen: Side, chosenSlot: SlotType): void;
  resetCards(): void;
  showGameOver(reason: "TURNS" | "LIVES", state: RunState): void;
  hideGameOver(): void;
}

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

function setText(id: string, value: string) {
  el<HTMLElement>(id).textContent = value;
}

export function createUI(
  getState: () => RunState,
  onRestart: () => void,
  onFlip: (side: Side) => void,
  onBank: () => void,
): UIBindings {
  const hudLives = el<HTMLDivElement>("hudLives");
  const hudTurns = el<HTMLDivElement>("hudTurns");
  const hudStreak = el<HTMLDivElement>("hudStreak");
  const hudTotal = el<HTMLDivElement>("hudTotalScore");
  const hudTier = el<HTMLDivElement>("hudTrophyTier");
  const hudShield = el<HTMLDivElement>("hudShield");
  const hudScrambler = el<HTMLDivElement>("hudScrambler");
  const hudJammer = el<HTMLDivElement>("hudJammer");

  const messageTitle = el<HTMLDivElement>("messageTitle");
  const messageBody = el<HTMLDivElement>("messageBody");

  const cardLeft = el<HTMLButtonElement>("cardLeft");
  const cardRight = el<HTMLButtonElement>("cardRight");
  const btnBank = el<HTMLButtonElement>("btnBank");
  const btnRestart = el<HTMLButtonElement>("btnRestart");
  const btnPlayAgain = el<HTMLButtonElement>("btnPlayAgain");

  const gameOver = el<HTMLDivElement>("gameOver");
  const gameOverTitle = el<HTMLHeadingElement>("gameOverTitle");
  const gameOverSummary = el<HTMLParagraphElement>("gameOverSummary");

  const uniqueSlots = Array.from(
    document.querySelectorAll<HTMLSpanElement>("#hudUniques .unique-slot"),
  );

  let inputLocked = false;

  function lockInput(lock: boolean) {
    inputLocked = lock;

    // disable card buttons visually
    if (lock) {
      cardLeft.classList.add("disabled");
      cardRight.classList.add("disabled");
      cardLeft.disabled = true;
      cardRight.disabled = true;
      btnBank.disabled = true; // temporary; render() will re-enable when appropriate
    } else {
      cardLeft.classList.remove("disabled");
      cardRight.classList.remove("disabled");
      cardLeft.disabled = false;
      cardRight.disabled = false;
      // bank button handled by render() so it reflects canBank()
    }
  }

  function setMessage(title: string, body?: string) {
    messageTitle.textContent = title;
    if (body !== undefined) messageBody.textContent = body;
  }

  function resetCards() {
    // Clear all state classes so we show card backs again
    for (const card of [cardLeft, cardRight]) {
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

  function applySlotClass(card: HTMLButtonElement, slot: SlotType) {
    card.classList.remove("treasure", "bomb");
    card.classList.add(slot === "TREASURE" ? "treasure" : "bomb");
  }

  function revealBoth(state: RunState, chosen: Side, chosenSlot: SlotType) {
    // Apply the hidden truth to both cards for the front-face image
    applySlotClass(cardLeft, state.leftSlot);
    applySlotClass(cardRight, state.rightSlot);

    // Reveal both (you can change to only reveal chosen if you prefer)
    cardLeft.classList.add("revealed");
    cardRight.classList.add("revealed");

    // Outcome highlight on chosen card only
    const chosenCard = chosen === "LEFT" ? cardLeft : cardRight;
    chosenCard.classList.add("selected");
    if (chosenSlot === "TREASURE") chosenCard.classList.add("win");
    else chosenCard.classList.add("lose");
  }

  function showGameOver(reason: "TURNS" | "LIVES", state: RunState) {
    gameOver.classList.remove("hidden");
    const tier = GC.trophyTier(state.totalScore);
    gameOverTitle.textContent =
      reason === "TURNS" ? "Out of turns" : "Out of lives";
    gameOverSummary.textContent = `Final score: ${state.totalScore} • Trophy: ${tier}`;
  }

  function hideGameOver() {
    gameOver.classList.add("hidden");
  }

  function render(state: RunState) {
    hudLives.textContent = String(state.lives);
    hudTurns.textContent = String(state.turnsLeft);
    hudStreak.textContent = String(state.streak);
    hudTotal.textContent = String(state.totalScore);
    hudTier.textContent = GC.trophyTier(state.totalScore);

    hudShield.textContent = state.hasShield ? "On" : "Off";
    hudScrambler.textContent = String(state.scramblerCharges);
    hudJammer.textContent = String(state.jammerTurns);

    // fill uniques
    for (const slot of uniqueSlots) {
      const n = Number(slot.dataset.n);
      const filled = state.uniques.has(n);
      slot.classList.toggle("filled", filled);
    }

    // bank button only when allowed and input is not locked
    btnBank.disabled = !GC.canBank(state);

    // show lastEvent if you want
    if (state.lastEvent) {
      // keep title stable, update body
      messageBody.textContent = state.lastEvent;
    }
  }

  function init() {
    cardLeft.addEventListener("click", () => {
      if (inputLocked) return;
      onFlip("LEFT");
    });
    cardRight.addEventListener("click", () => {
      if (inputLocked) return;
      onFlip("RIGHT");
    });

    btnBank.addEventListener("click", () => {
      if (inputLocked) return;
      onBank();
    });

    btnRestart.addEventListener("click", () => {
      console.log("[UI] Restart clicked");
      onRestart();
    });

    btnPlayAgain.addEventListener("click", () => {
      console.log("[UI] Play again clicked");
      onRestart();
    });
  }

  return {
    init,
    render,
    setMessage,
    lockInput,
    resetCards,
    revealBoth,
    showGameOver,
    hideGameOver,
  };
}
