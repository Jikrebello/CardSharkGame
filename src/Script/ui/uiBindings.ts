import {
  IGameUI_DOM_Elements,
  IGameUIBindingsController,
  IUIActions,
} from "../domain/data/data.interfaces";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

export function createBindings(actions: IUIActions): IGameUIBindingsController {
  const dom: IGameUI_DOM_Elements = {
    hudLives: el<HTMLDivElement>("hudLives"),
    hudTurns: el<HTMLDivElement>("hudTurns"),
    hudStreak: el<HTMLDivElement>("hudStreak"),
    hudTotal: el<HTMLDivElement>("hudTotalScore"),
    hudTier: el<HTMLDivElement>("hudTrophyTier"),
    hudShield: el<HTMLDivElement>("hudShield"),
    hudScrambler: el<HTMLDivElement>("hudScrambler"),
    hudJammer: el<HTMLDivElement>("hudJammer"),

    messageTitle: el<HTMLDivElement>("messageTitle"),
    messageBody: el<HTMLDivElement>("messageBody"),

    cardLeft: el<HTMLButtonElement>("cardLeft"),
    cardRight: el<HTMLButtonElement>("cardRight"),
    btnBank: el<HTMLButtonElement>("btnBank"),
    btnRestart: el<HTMLButtonElement>("btnRestart"),
    btnPlayAgain: el<HTMLButtonElement>("btnPlayAgain"),

    gameOver: el<HTMLDivElement>("gameOver"),
    gameOverTitle: el<HTMLHeadingElement>("gameOverTitle"),
    gameOverSummary: el<HTMLParagraphElement>("gameOverSummary"),

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
