import "babylonjs";
import "babylonjs-loaders";
import "../Style/ui.less";
import { createGameLoop } from "./app/gameLoop";
import { createEngineScene } from "./engine/scene";
import { initTrophySystem } from "./engine/trophy/trophySystem";
import { createUI } from "./ui/uiController";

document.addEventListener("DOMContentLoaded", function (event) {
  createScene(true);
});

const createScene = (_dev: boolean) => {
  const { scene } = createEngineScene();

  initTrophySystem(scene);

  let loop!: ReturnType<typeof createGameLoop>;

  const ui = createUI(
    () => loop.getState(),
    () => loop.restartGame(),
    (side) => loop.handleFlip(side),
    () => loop.handleBank(),
  );

  ui.init();

  loop = createGameLoop(ui);
  loop.start();

  return scene;
};
