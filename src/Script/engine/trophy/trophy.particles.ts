import { TrophyAssets, TrophyTier } from "../../domain/data/data.types";

export function createParticleSystem(
  scene: BABYLON.Scene,
  emitter: BABYLON.AbstractMesh,
): BABYLON.ParticleSystem {
  const ps = new BABYLON.ParticleSystem("trophyWinParticles", 200, scene);
  ps.emitter = emitter;
  ps.minEmitBox = new BABYLON.Vector3(-0.15, -0.1, -0.15);
  ps.maxEmitBox = new BABYLON.Vector3(0.15, 0.1, 0.15);

  ps.particleTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/flare.png",
    scene,
  );

  ps.color1 = new BABYLON.Color4(1, 0.9, 0.4, 1);
  ps.color2 = new BABYLON.Color4(1, 1, 1, 1);
  ps.colorDead = new BABYLON.Color4(0.2, 0.2, 0.2, 0);

  ps.minSize = 0.08;
  ps.maxSize = 0.22;
  ps.minLifeTime = 0.25;
  ps.maxLifeTime = 0.9;

  ps.emitRate = 0;
  ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

  ps.gravity = new BABYLON.Vector3(0, -1.5, 0);
  ps.direction1 = new BABYLON.Vector3(-1, 2, -1);
  ps.direction2 = new BABYLON.Vector3(1, 3, 1);

  ps.minEmitPower = 0.8;
  ps.maxEmitPower = 2.4;
  ps.updateSpeed = 0.01;

  return ps;
}

export function burstParticles(
  assets: TrophyAssets,
  tier: Exclude<TrophyTier, "NONE">,
): void {
  if (!assets.particle) return;

  const ps = assets.particle;

  if (tier === "GOLD") {
    ps.color1 = new BABYLON.Color4(1.0, 0.85, 0.2, 1);
    ps.color2 = new BABYLON.Color4(1.0, 0.95, 0.6, 1);
  } else if (tier === "SILVER") {
    ps.color1 = new BABYLON.Color4(0.78, 0.86, 1.0, 1);
    ps.color2 = new BABYLON.Color4(1, 1, 1, 1);
  } else {
    ps.color1 = new BABYLON.Color4(0.82, 0.52, 0.25, 1);
    ps.color2 = new BABYLON.Color4(1.0, 0.8, 0.55, 1);
  }

  ps.stop();
  ps.manualEmitCount = tier === "GOLD" ? 120 : tier === "SILVER" ? 90 : 70;
  ps.start();

  window.setTimeout(() => ps.stop(), 700);
}
