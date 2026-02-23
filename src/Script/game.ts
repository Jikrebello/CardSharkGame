import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import "../Style/ui.less";
(window as any).BABYLON = BABYLON;

import { createGameLoop } from "./app/gameLoop";
import { createEngineScene } from "./engine/scene";
import { initTrophySystem } from "./engine/trophy/trophySystem";
import { createUI } from "./ui/uiController";

window.addEventListener("DOMContentLoaded", () => {
  const engineScene = createEngineScene();

  initTrophySystem(engineScene.scene);

  let gameLoopRef: ReturnType<typeof createGameLoop> | null = null;

  const ui = createUI(
    () => {
      if (!gameLoopRef) {
        throw new Error("Game loop not initialized yet.");
      }
      return gameLoopRef.getState();
    },
    () => {
      gameLoopRef?.restartGame();
    },
    (side) => {
      gameLoopRef?.handleFlip(side);
    },
    () => {
      gameLoopRef?.continueAfterWin();
    },
  );

  gameLoopRef = createGameLoop(ui);

  ui.init();
  gameLoopRef.start();

  window.addEventListener("beforeunload", () => {
    engineScene.dispose();
  });
});
