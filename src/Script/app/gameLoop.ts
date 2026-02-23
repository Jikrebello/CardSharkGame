import { FLIP_REVEAL_TIME } from "../domain/data/data.consts";
import {
  getChosenSlot,
  getFlipMessage,
  isFlipTerminal,
} from "../domain/data/data.funcs";
import type {
  IGameLoop,
  IRunState,
  IUIBindings,
} from "../domain/data/data.interfaces";
import type { Side, TurnResult } from "../domain/data/data.types";
import * as GameStateManager from "../domain/gameStateTransitions";

class GameLoop implements IGameLoop {
  private state: IRunState;
  private readonly ui: IUIBindings;
  private cardClickSfx: HTMLAudioElement | null = null;

  constructor(ui: IUIBindings) {
    this.ui = ui;
    this.state = GameStateManager.newGame();

    try {
      this.cardClickSfx = new Audio("./Audio/SFX/Click-96-k.aac");
      this.cardClickSfx.preload = "auto";
      this.cardClickSfx.volume = 0.6;
    } catch {
      this.cardClickSfx = null;
    }
  }

  public getState(): IRunState {
    return this.state;
  }

  public start(): void {
    this.restartGame();
  }

  public restartGame(): void {
    this.state = GameStateManager.newGame();

    this.ui.hideWinTrophy?.();
    this.ui.lockInput(false);
    this.ui.resetCards();

    this.ui.setMessage("Pick a card", "Find the treasure. Avoid the bomb.");

    this.ui.render(this.state);
    this.advanceToNextTurn({ unlockInput: true });
  }

  public handleFlip(side: Side): void {
    this.ui.lockInput(true);
    this.playCardClickSfx();

    const chosenSlot = getChosenSlot(this.state, side);
    const result = GameStateManager.flip(this.state, side);

    this.ui.revealBoth(this.state, side, chosenSlot, result);
    this.ui.render(this.state);

    const message = getFlipMessage(result);
    if (message) {
      this.ui.setMessage(message.title, message.body);
    }

    window.setTimeout(() => {
      this.finishFlip(result);
    }, FLIP_REVEAL_TIME);
  }

  public continueAfterWin(): void {
    this.ui.hideWinTrophy?.();
    this.advanceToNextTurn({ unlockInput: true });
  }

  private finishFlip(result: TurnResult): void {
    if (!isFlipTerminal(result)) {
      this.advanceToNextTurn({ unlockInput: true });
      return;
    }

    if (result.kind === "WIN") {
      this.ui.showWinTrophy?.();
      this.ui.lockInput(true);
      return;
    }

    this.ui.hideWinTrophy?.();
    this.advanceToNextTurn({ unlockInput: true });
  }

  private advanceToNextTurn(opts?: { unlockInput?: boolean }): void {
    GameStateManager.startNextTurn(this.state);

    this.ui.resetCards();

    if (opts?.unlockInput) {
      this.ui.lockInput(false);
    }

    this.ui.render(this.state);
  }

  private playCardClickSfx(): void {
    if (!this.cardClickSfx) return;

    try {
      this.cardClickSfx.currentTime = 0;
      void this.cardClickSfx.play();
    } catch {}
  }
}

export function createGameLoop(ui: IUIBindings): IGameLoop {
  return new GameLoop(ui);
}
