import { trophyTier } from "../domain/data/data.funcs";
import {
  IGameUI_DOM_Elements,
  IGameUIRenderer,
  IRunState,
} from "../domain/data/data.interfaces";
import { GameOverReason } from "../domain/data/data.types";
import { canBank } from "../domain/gameStateTransitions";

export function createRenderer(dom: IGameUI_DOM_Elements): IGameUIRenderer {
  function setMessage(title: string, body?: string) {
    dom.messageTitle.textContent = title;
    if (body !== undefined) dom.messageBody.textContent = body;
  }

  function hideGameOver() {
    dom.gameOver.classList.add("hidden");
  }

  function showGameOver(reason: GameOverReason, state: IRunState) {
    dom.gameOver.classList.remove("hidden");

    const tier = trophyTier(state.totalScore);
    dom.gameOverTitle.textContent =
      reason === "TURNS" ? "Out of turns" : "Out of lives";
    dom.gameOverSummary.textContent = `Final score: ${state.totalScore} • Trophy: ${tier}`;
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
      slot.classList.toggle("filled", state.uniques.has(n));
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
