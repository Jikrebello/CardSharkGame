import { Side, SlotType, TurnResult } from "./data.types";

export interface IRunState {
  streak: number;
  leftSlot: SlotType;
  rightSlot: SlotType;
  lastEvent?: string;
}

export interface IGameLoop {
  start(): void;
  restartGame(): void;
  handleFlip(side: Side): void;
  continueAfterWin(): void;
  getState(): IRunState;
}

export interface IUiMessage {
  title: string;
  body?: string;
}

export interface IUIBindings {
  init(): void;
  render(state: IRunState): void;
  setMessage(title: string, body?: string): void;
  lockInput(lock: boolean): void;
  revealBoth(
    state: IRunState,
    chosen: Side,
    chosenSlot: SlotType,
    result: TurnResult,
  ): void;
  resetCards(): void;

  showWinTrophy?(): void;
  hideWinTrophy?(): void;
}

export interface IEngineScene {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  light: BABYLON.DirectionalLight;
  camera: BABYLON.ArcRotateCamera;
  dispose(): void;
}

export interface IGameUIAnimations {
  lockInput(lock: boolean): void;
  resetCards(): void;
  revealBoth(
    state: IRunState,
    chosen: Side,
    chosenSlot: SlotType,
    result: TurnResult,
  ): void;
}

export interface IGameUIDomElements {
  hudStreak: HTMLDivElement;

  messageTitle: HTMLDivElement;
  messageBody: HTMLDivElement;

  cardLeft: HTMLButtonElement;
  cardRight: HTMLButtonElement;
  btnRestart: HTMLButtonElement;

  btnRules?: HTMLButtonElement;
  rulesModal?: HTMLDivElement;
  btnRulesClose?: HTMLButtonElement;
  btnRulesCloseFooter?: HTMLButtonElement;

  endScreen?: HTMLDivElement;
  btnPlayAgain?: HTMLButtonElement;
}

export interface IUIActions {
  onRestart: () => void;
  onFlip: (side: Side) => void;
  onContinueAfterWin: () => void;
}

export interface IGameUIBindingsController {
  dom: IGameUIDomElements;
  bind(): void;
  setInputLocked(lock: boolean): void;
  isInputLocked(): boolean;
}

export interface IGameUIRenderer {
  render(state: IRunState, opts?: { inputLocked?: boolean }): void;
  setMessage(title: string, body?: string): void;
  showWinTrophy?(): void;
  hideWinTrophy?(): void;
}
