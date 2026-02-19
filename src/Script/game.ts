import "babylonjs";
import "babylonjs-loaders";
import * as GC from "./gameController";
import type { RunState } from "./gameState";
import { createUI } from "./uiBindings";

export const createScene = (dev: boolean) => {
  const canvas = document.getElementById(
    "canvas",
  ) as unknown as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas, true, {}, true);
  const scene = new BABYLON.Scene(engine);

  scene.clearColor = new BABYLON.Color4(0.44, 0.61, 0.58, 1);

  const light = new BABYLON.DirectionalLight(
    "Light",
    new BABYLON.Vector3(
      BABYLON.Tools.ToRadians(-45),
      BABYLON.Tools.ToRadians(-45),
      0,
    ),
    scene,
  );

  const mainCamera = new BABYLON.ArcRotateCamera(
    "MainCamera",
    BABYLON.Tools.ToRadians(45),
    BABYLON.Tools.ToRadians(45),
    10,
    BABYLON.Vector3.Zero(),
    scene,
  );

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());

  // --- Game wiring ---
  let state: RunState = GC.newGame(); // uses DEFAULT_MAX_TURNS

  const ui = createUI(
    () => state,
    () => restartGame(),
    (side) => handleFlip(side),
    () => handleBank(),
  );

  ui.init();

  function restartGame() {
    state = GC.newGame();

    ui.hideGameOver();
    ui.lockInput(false);
    ui.resetCards();

    ui.setMessage(
      "Pick a card",
      "Try to build a run, then bank before you bust.",
    );

    ui.render(state);

    const r = GC.startNextTurn(state);
    if (r.kind === "GAME_OVER") {
      ui.showGameOver(r.reason, state);
      ui.lockInput(true);
    } else {
      ui.resetCards();
      ui.render(state);
    }
  }

  function handleBank() {
    // bank does not consume turns
    const r = GC.bank(state);
    ui.setMessage("Banked!", `+${r.points} points`);
    ui.resetCards();
    ui.render(state);

    // next turn or game over if turns already hit 0 (shouldn't normally happen)
    const next = GC.startNextTurn(state);
    if (next.kind === "GAME_OVER") {
      ui.showGameOver(next.reason, state);
      ui.lockInput(true);
    } else {
      ui.resetCards();
      ui.render(state);
    }
  }

  function handleFlip(side: "LEFT" | "RIGHT") {
    ui.lockInput(true);

    const chosenSlot = side === "LEFT" ? state.leftSlot : state.rightSlot;

    // resolve via controller (this decrements turnsLeft)
    const r = GC.flip(state, side);

    // reveal UI immediately based on the *current turn* slots
    ui.revealBoth(state, side, chosenSlot);
    ui.render(state);

    // decide messaging
    if (r.kind === "BOMB_HIT") {
      ui.setMessage(
        "Boom.",
        r.shieldSaved ? "Shield saved you. Streak reset." : "Lost a life.",
      );
    } else if (r.kind === "TREASURE") {
      if (r.loot.kind === "NUMBER") {
        ui.setMessage("Treasure!", `Loot: ${r.loot.value}`);
      } else {
        ui.setMessage("Joker!", `Loot: ${r.loot.value}`);
      }
      if (r.duplicateBusted)
        ui.setMessage("Run busted.", "Duplicate ended your run.");
    } else if (r.kind === "GAME_OVER") {
      // rare path: flip called after game already over
    }

    // after a short reveal delay, advance
    window.setTimeout(() => {
      // if controller reports game over, stop here
      const over =
        (r.kind === "BOMB_HIT" && r.gameOver) ||
        (r.kind === "TREASURE" && r.gameOver);

      if (over) {
        // reason is attached on BOMB_HIT in the modified controller; otherwise infer
        const reason = state.lives <= 0 ? "LIVES" : "TURNS";
        ui.showGameOver(reason, state);
        ui.lockInput(true);
        return;
      }

      // next turn
      const next = GC.startNextTurn(state);
      if (next.kind === "GAME_OVER") {
        ui.showGameOver(next.reason, state);
        ui.lockInput(true);
        return;
      }

      ui.resetCards();

      ui.lockInput(false);

      ui.render(state);
    }, 1000);
  }

  // start
  restartGame();
};
