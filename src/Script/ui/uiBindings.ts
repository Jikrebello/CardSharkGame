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

function getOptionalElementById<T extends HTMLElement>(
  id: string,
): T | undefined {
  const node = document.getElementById(id);
  return node ? (node as T) : undefined;
}

export function initializeUIBindings(
  actions: IUIActions,
): IGameUIBindingsController {
  const dom: IGameUiDomElements = {
    hudStreak: getElementById<HTMLDivElement>("hudStreak"),

    messageTitle: getElementById<HTMLDivElement>("messageTitle"),
    messageBody: getElementById<HTMLDivElement>("messageBody"),

    cardLeft: getElementById<HTMLButtonElement>("cardLeft"),
    cardRight: getElementById<HTMLButtonElement>("cardRight"),
    btnRestart: getElementById<HTMLButtonElement>("btnRestart"),

    btnRules: getOptionalElementById<HTMLButtonElement>("btnRules"),
    rulesModal: getOptionalElementById<HTMLDivElement>("rulesModal"),
    btnRulesClose: getOptionalElementById<HTMLButtonElement>("btnRulesClose"),
    btnRulesCloseFooter: getOptionalElementById<HTMLButtonElement>(
      "btnRulesCloseFooter",
    ),

    endScreen: getOptionalElementById<HTMLDivElement>("endScreen"),
    btnPlayAgain: getOptionalElementById<HTMLButtonElement>("btnPlayAgain"),
  };

  let inputLocked = false;
  let lastFocusedBeforeRules: HTMLElement | null = null;

  function setInputLocked(lock: boolean) {
    inputLocked = lock;
  }

  function isInputLocked() {
    return inputLocked;
  }

  function isRulesWired(): boolean {
    return !!(
      dom.btnRules &&
      dom.rulesModal &&
      dom.btnRulesClose &&
      dom.btnRulesCloseFooter
    );
  }

  function showRules(): void {
    if (!isRulesWired() || !dom.rulesModal || !dom.btnRulesClose) return;

    lastFocusedBeforeRules = document.activeElement as HTMLElement | null;
    dom.rulesModal.classList.remove("hidden");
    dom.rulesModal.setAttribute("aria-hidden", "false");
    dom.btnRulesClose.focus();
  }

  function hideRules(): void {
    if (!isRulesWired() || !dom.rulesModal || !dom.btnRules) return;

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
    return !!dom.rulesModal && !dom.rulesModal.classList.contains("hidden");
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

    dom.btnRestart.addEventListener("click", () => {
      if (isRulesOpen()) hideRules();
      actions.onRestart();
    });

    dom.btnPlayAgain?.addEventListener("click", () => {
      actions.onContinueAfterWin();
    });

    // Rules modal wiring (if present)
    dom.btnRules?.addEventListener("click", () => {
      if (isRulesOpen()) {
        hideRules();
      } else {
        showRules();
      }
    });

    dom.btnRulesClose?.addEventListener("click", () => {
      hideRules();
    });

    dom.btnRulesCloseFooter?.addEventListener("click", () => {
      hideRules();
    });

    dom.rulesModal?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("rules-backdrop")) {
        hideRules();
      }
    });

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
