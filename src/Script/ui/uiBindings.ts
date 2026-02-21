import {
  IGameUIBindingsController,
  IGameUIDomElements as IGameUiDomElements,
  IUIActions,
} from "../domain/data/data.interfaces";

function getElementById<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

export function initializeUIBindings(
  actions: IUIActions,
): IGameUIBindingsController {
  const dom: IGameUiDomElements = {
    hudLives: getElementById<HTMLDivElement>("hudLives"),
    hudTurns: getElementById<HTMLDivElement>("hudTurns"),
    hudStreak: getElementById<HTMLDivElement>("hudStreak"),
    hudTotal: getElementById<HTMLDivElement>("hudTotalScore"),
    hudTier: getElementById<HTMLDivElement>("hudTrophyTier"),
    hudShield: getElementById<HTMLDivElement>("hudShield"),
    hudScrambler: getElementById<HTMLDivElement>("hudScrambler"),
    hudJammer: getElementById<HTMLDivElement>("hudJammer"),

    messageTitle: getElementById<HTMLDivElement>("messageTitle"),
    messageBody: getElementById<HTMLDivElement>("messageBody"),

    cardLeft: getElementById<HTMLButtonElement>("cardLeft"),
    cardRight: getElementById<HTMLButtonElement>("cardRight"),
    btnBank: getElementById<HTMLButtonElement>("btnBank"),
    btnRestart: getElementById<HTMLButtonElement>("btnRestart"),
    btnPlayAgain: getElementById<HTMLButtonElement>("btnPlayAgain"),

    gameScreen: getElementById<HTMLDivElement>("gameScreen"),

    endScreen: getElementById<HTMLDivElement>("endScreen"),
    endTitle: getElementById<HTMLHeadingElement>("endTitle"),
    endSummary: getElementById<HTMLParagraphElement>("endSummary"),
    endScoreValue: getElementById<HTMLElement>("endScoreValue"),
    endTrophyValue: getElementById<HTMLElement>("endTrophyValue"),
    endTierBadge: getElementById<HTMLDivElement>("endTierBadge"),

    uniqueSlots: Array.from(
      document.querySelectorAll<HTMLSpanElement>("#hudUniques .unique-slot"),
    ),
  };

  let inputLocked = false;

  function setInputLocked(lock: boolean) {
    inputLocked = lock;
  }

  function isInputLocked() {
    return inputLocked;
  }

  function bind() {
    dom.cardLeft.addEventListener("click", () => {
      if (inputLocked) return;
      actions.onFlip("LEFT");
    });

    dom.cardRight.addEventListener("click", () => {
      if (inputLocked) return;
      actions.onFlip("RIGHT");
    });

    dom.btnBank.addEventListener("click", () => {
      if (inputLocked) return;
      actions.onBank();
    });

    dom.btnRestart.addEventListener("click", () => {
      actions.onRestart();
    });

    dom.btnPlayAgain.addEventListener("click", () => {
      actions.onRestart();
    });
  }

  return {
    dom,
    bind,
    setInputLocked,
    isInputLocked,
  };
}
