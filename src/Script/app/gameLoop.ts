import { FLIP_REVEAL_TIME } from "../domain/data/data.consts";
import {
  getChosenSlot,
  getFlipMessage,
  isFlipTerminal,
} from "../domain/data/data.funcs";
import type {
  IAdvanceOptions,
  IGameLoop,
  IRunState,
  IUIBindings,
} from "../domain/data/data.interfaces";
import type { Side, TurnResult } from "../domain/data/data.types";
import { resolveGameOverReasonAfterFlip } from "../domain/gameResolvers";
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

    this.resetUiForFreshGame();

    this.ui.setMessage(
      "Pick a card",
      "Try to build a run, then bank before you bust.",
    );

    this.ui.render(this.state);
    this.advanceToNextTurnOrGameOver({ unlockInput: true });
  }

  public handleBank(): void {
    if (!GameStateManager.canBank(this.state)) return;

    const bankResult = GameStateManager.bank(this.state);

    this.ui.setMessage("Banked!", `+${bankResult.points} points`);
    this.ui.resetCards();
    this.ui.render(this.state);

    this.advanceToNextTurnOrGameOver({ unlockInput: true });
  }

  public handleFlip(side: Side): void {
    this.ui.lockInput(true);
    this.playCardClickSfx();
    const chosenSlot = getChosenSlot(this.state, side);
    const result = GameStateManager.flip(this.state, side);

    this.revealFlip(side, chosenSlot, result);
    this.ui.render(this.state);

    const message = getFlipMessage(result);
    if (message) {
      this.ui.setMessage(message.title, message.body);
    }

    window.setTimeout(() => {
      this.finishFlip(result);
    }, FLIP_REVEAL_TIME);
  }

  private resetUiForFreshGame(): void {
    this.ui.hideGameOver();
    this.ui.lockInput(false);
    this.ui.resetCards();
  }

  private revealFlip(
    side: Side,
    chosenSlot: IRunState["leftSlot"],
    result: TurnResult,
  ): void {
    this.ui.revealBoth(this.state, side, chosenSlot, result);
  }

  private finishFlip(result: TurnResult): void {
    if (isFlipTerminal(result)) {
      const reason = resolveGameOverReasonAfterFlip(this.state, result);
      this.ui.showGameOver(reason, this.state);
      this.ui.lockInput(true);
      return;
    }

    this.advanceToNextTurnOrGameOver({ unlockInput: true });
  }

  private advanceToNextTurnOrGameOver(opts?: IAdvanceOptions): void {
    const next = GameStateManager.startNextTurn(this.state);

    if (next.kind === "GAME_OVER") {
      this.ui.showGameOver(next.reason, this.state);
      this.ui.lockInput(true);
      return;
    }

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
