import { GameOverReason, Side, SlotType } from "./data.types";

export interface IRunState {
  lives: number;
  totalScore: number;
  turnsLeft: number;
  maxTurns: number;

  streak: number;
  uniques: Set<number>;

  hasShield: boolean;
  scramblerCharges: number;
  jammerTurns: number;

  leftSlot: SlotType;
  rightSlot: SlotType;

  lastEvent?: string;
}

export interface IGameLoop {
  start(): void;
  restartGame(): void;
  handleBank(): void;
  handleFlip(side: Side): void;
  getState(): IRunState;
}

export interface IGameLoopContext {
  ui: IUIBindings;
  getState(): IRunState;
  setState(next: IRunState): void;
}

export interface IAdvanceOptions {
  unlockInput?: boolean;
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
  revealBoth(state: IRunState, chosen: Side, chosenSlot: SlotType): void;
  resetCards(): void;
  showGameOver(reason: GameOverReason, state: IRunState): void;
  hideGameOver(): void;
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
  revealBoth(state: IRunState, chosen: Side, chosenSlot: SlotType): void;
}

export interface IGameUIDomElements {
  // HUD
  hudLives: HTMLDivElement;
  hudTurns: HTMLDivElement;
  hudStreak: HTMLDivElement;
  hudTotal: HTMLDivElement;
  hudTier: HTMLDivElement;
  hudShield: HTMLDivElement;
  hudScrambler: HTMLDivElement;
  hudJammer: HTMLDivElement;

  // Message
  messageTitle: HTMLDivElement;
  messageBody: HTMLDivElement;

  // Cards / controls
  cardLeft: HTMLButtonElement;
  cardRight: HTMLButtonElement;
  btnBank: HTMLButtonElement;
  btnRestart: HTMLButtonElement;
  btnPlayAgain: HTMLButtonElement;

  // End game screen
  gameScreen: HTMLDivElement;
  endScreen: HTMLDivElement;
  endTitle: HTMLHeadingElement;
  endSummary: HTMLParagraphElement;
  endScoreValue: HTMLElement;
  endTrophyValue: HTMLElement;
  endTierBadge: HTMLDivElement;

  // Uniques
  uniqueSlots: HTMLSpanElement[];
}

export interface IUIActions {
  onRestart: () => void;
  onFlip: (side: Side) => void;
  onBank: () => void;
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
  showGameOver(reason: GameOverReason, state: IRunState): void;
  hideGameOver(): void;
}
