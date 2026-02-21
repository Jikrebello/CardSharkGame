import "babylonjs";
import { IEngineScene } from "../domain/data/data.interfaces";

export function createEngineScene(): IEngineScene {
  const canvasEl = document.getElementById("canvas");
  if (!(canvasEl instanceof HTMLCanvasElement)) {
    throw new Error('Missing <canvas id="canvas"> element');
  }
  const canvas = canvasEl;

  const engine = new BABYLON.Engine(canvas, true, {}, true);
  const scene = new BABYLON.Scene(engine);

  // Background color
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

  const camera = new BABYLON.ArcRotateCamera(
    "MainCamera",
    BABYLON.Tools.ToRadians(45),
    BABYLON.Tools.ToRadians(45),
    10,
    BABYLON.Vector3.Zero(),
    scene,
  );

  engine.runRenderLoop(() => {
    scene.render();
  });

  const onResize = () => engine.resize();
  window.addEventListener("resize", onResize);

  function dispose() {
    window.removeEventListener("resize", onResize);
    scene.dispose();
    engine.dispose();
  }

  return {
    canvas,
    engine,
    scene,
    light,
    camera,
    dispose,
  };
}
