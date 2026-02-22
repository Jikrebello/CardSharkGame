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

    // NEW
    btnRules: getElementById<HTMLButtonElement>("btnRules"),
    rulesModal: getElementById<HTMLDivElement>("rulesModal"),
    btnRulesClose: getElementById<HTMLButtonElement>("btnRulesClose"),
    btnRulesCloseFooter: getElementById<HTMLButtonElement>(
      "btnRulesCloseFooter",
    ),

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
  let lastFocusedBeforeRules: HTMLElement | null = null;

  function setInputLocked(lock: boolean) {
    inputLocked = lock;
  }

  function isInputLocked() {
    return inputLocked;
  }

  function showRules(): void {
    lastFocusedBeforeRules = document.activeElement as HTMLElement | null;
    dom.rulesModal.classList.remove("hidden");
    dom.rulesModal.setAttribute("aria-hidden", "false");
    dom.btnRulesClose.focus();
  }

  function hideRules(): void {
    dom.rulesModal.classList.add("hidden");
    dom.rulesModal.setAttribute("aria-hidden", "true");

    if (
      lastFocusedBeforeRules &&
      typeof lastFocusedBeforeRules.focus === "function"
    ) {
      lastFocusedBeforeRules.focus();
    } else {
      dom.btnRules.focus();
    }
  }

  function isRulesOpen(): boolean {
    return !dom.rulesModal.classList.contains("hidden");
  }

  function bind() {
    dom.cardLeft.addEventListener("click", () => {
      if (inputLocked || isRulesOpen()) return;
      actions.onFlip("LEFT");
    });

    dom.cardRight.addEventListener("click", () => {
      if (inputLocked || isRulesOpen()) return;
      actions.onFlip("RIGHT");
    });

    dom.btnBank.addEventListener("click", () => {
      if (inputLocked || isRulesOpen()) return;
      actions.onBank();
    });

    dom.btnRestart.addEventListener("click", () => {
      if (isRulesOpen()) {
        hideRules();
      }
      actions.onRestart();
    });

    dom.btnPlayAgain.addEventListener("click", () => {
      actions.onRestart();
    });

    // NEW: rules open/close
    dom.btnRules.addEventListener("click", () => {
      if (isRulesOpen()) {
        hideRules();
        return;
      }
      showRules();
    });

    dom.btnRulesClose.addEventListener("click", () => {
      hideRules();
    });

    dom.btnRulesCloseFooter.addEventListener("click", () => {
      hideRules();
    });

    // Backdrop click (delegate on modal wrapper)
    dom.rulesModal.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("rules-backdrop")) {
        hideRules();
      }
    });

    // Escape closes rules modal
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isRulesOpen()) {
        hideRules();
      }
    });
  }

  return {
    dom,
    bind,
    setInputLocked,
    isInputLocked,
  };
}
