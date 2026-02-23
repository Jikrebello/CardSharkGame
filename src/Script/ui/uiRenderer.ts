import {
  IGameUIDomElements,
  IGameUIRenderer,
  IRunState,
} from "../domain/data/data.interfaces";
import {
  hideTrophyAward,
  showTrophyAward,
} from "../engine/trophy/trophySystem";

export function createRenderer(dom: IGameUIDomElements): IGameUIRenderer {
  function setMessage(title: string, body?: string): void {
    dom.messageTitle.textContent = title;
    if (body !== undefined) {
      dom.messageBody.textContent = body;
    }
  }

  function render(state: IRunState): void {
    dom.hudStreak.textContent = String(state.streak);

    if (state.lastEvent) {
      dom.messageBody.textContent = state.lastEvent;
    }
  }

  function showWinTrophy(): void {
    if (!dom.endScreen) return;

    dom.endScreen.classList.remove("hidden");
    dom.endScreen.setAttribute("aria-hidden", "false");

    void showTrophyAward("GOLD");
  }

  function hideWinTrophy(): void {
    if (!dom.endScreen) return;

    dom.endScreen.classList.add("hidden");
    dom.endScreen.setAttribute("aria-hidden", "true");

    hideTrophyAward();
  }

  return {
    render,
    setMessage,
    showWinTrophy,
    hideWinTrophy,
  };
}
