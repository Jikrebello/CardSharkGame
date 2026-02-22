import { getUniqueLabel, trophyTier } from "../domain/data/data.funcs";
import {
  IGameUIDomElements,
  IGameUIRenderer,
  IRunState,
} from "../domain/data/data.interfaces";
import { GameOverReason } from "../domain/data/data.types";
import { canBank } from "../domain/gameStateTransitions";
import {
  hideTrophyAward,
  showTrophyAward,
} from "../engine/trophy/trophySystem";

export function createRenderer(dom: IGameUIDomElements): IGameUIRenderer {
  function setMessage(title: string, body?: string) {
    dom.messageTitle.textContent = title;
    if (body !== undefined) dom.messageBody.textContent = body;
  }

  function hideGameOver() {
    dom.endScreen.classList.add("hidden");
    dom.endScreen.setAttribute("aria-hidden", "true");

    dom.gameScreen.classList.remove("is-deemphasized");

    hideTrophyAward();
  }

  function showGameOver(reason: GameOverReason, state: IRunState) {
    const tier = trophyTier(state.totalScore);

    dom.gameScreen.classList.add("is-deemphasized");

    dom.endTitle.textContent =
      reason === "TURNS" ? "Out of turns" : "Out of lives";
    dom.endSummary.textContent = `Final score: ${state.totalScore}`;
    dom.endScoreValue.textContent = String(state.totalScore);
    dom.endTrophyValue.textContent = tier;

    dom.endTierBadge.classList.remove(
      "tier-none",
      "tier-bronze",
      "tier-silver",
      "tier-gold",
    );

    const tierClass =
      tier === "GOLD"
        ? "tier-gold"
        : tier === "SILVER"
          ? "tier-silver"
          : tier === "BRONZE"
            ? "tier-bronze"
            : "tier-none";

    dom.endTierBadge.classList.add(tierClass);
    dom.endTierBadge.textContent =
      tier === "NONE" ? "No Trophy" : `${tier} Trophy`;

    dom.endScreen.classList.remove("hidden");
    dom.endScreen.setAttribute("aria-hidden", "false");

    void showTrophyAward(tier);
  }

  function render(state: IRunState, opts?: { inputLocked?: boolean }) {
    dom.hudLives.textContent = String(state.lives);
    dom.hudTurns.textContent = String(state.turnsLeft);
    dom.hudStreak.textContent = String(state.streak);
    dom.hudTotal.textContent = String(state.totalScore);
    dom.hudTier.textContent = trophyTier(state.totalScore);

    dom.hudShield.textContent = state.hasShield ? "On" : "Off";
    dom.hudScrambler.textContent = String(state.scramblerCharges);
    dom.hudJammer.textContent = String(state.jammerTurns);

    for (const slot of dom.uniqueSlots) {
      const n = Number(slot.dataset.n);
      const isFilled = state.uniques.has(n);

      slot.classList.toggle("filled", isFilled);

      slot.textContent = getUniqueLabel(n, "short");

      slot.setAttribute(
        "aria-label",
        isFilled
          ? `${getUniqueLabel(n, "long")} collected`
          : `${getUniqueLabel(n, "long")} not collected`,
      );
      slot.title = getUniqueLabel(n, "long");
    }

    const inputLocked = !!opts?.inputLocked;
    dom.btnBank.disabled = inputLocked || !canBank(state);

    if (state.lastEvent) {
      dom.messageBody.textContent = state.lastEvent;
    }
  }

  return {
    render,
    setMessage,
    showGameOver,
    hideGameOver,
  };
}
