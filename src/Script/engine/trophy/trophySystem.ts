import {
  TARGET_TROPHY_HEIGHT,
  TROPHY_ROT,
  TROPHY_STAGE_CAMERA_TARGET,
} from "../../domain/data/data.consts";
import { TrophyAssets, TrophyTier } from "../../domain/data/data.types";
import { applyTierMaterial } from "./trophy.materials";
import { burstParticles, createParticleSystem } from "./trophy.particles";
import { normalizeTrophyRoot } from "./trophy.transforms";

class TrophySystem {
  private trophyCanvas: HTMLCanvasElement | null = null;
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private camera: BABYLON.ArcRotateCamera | null = null;

  private assets: TrophyAssets | null = null;
  private loadPromise: Promise<void> | null = null;
  private spinObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>> =
    null;
  private awardSound: BABYLON.Nullable<BABYLON.Sound> = null;
  private resizeBound = false;

  private tierMaterials: Partial<
    Record<Exclude<TrophyTier, "NONE">, BABYLON.PBRMetallicRoughnessMaterial>
  > = {};

  public init(_mainScene: BABYLON.Scene): void {
    if (this.engine && this.scene) return;

    const canvasElement = document.getElementById("trophyCanvas");
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      console.warn("[trophy] #trophyCanvas not found or is not a <canvas>");
      return;
    }

    this.trophyCanvas = canvasElement;

    this.engine = new BABYLON.Engine(this.trophyCanvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.camera = new BABYLON.ArcRotateCamera(
      "trophyCamera",
      BABYLON.Tools.ToRadians(86),
      BABYLON.Tools.ToRadians(72),
      5.2,
      TROPHY_STAGE_CAMERA_TARGET,
      this.scene,
    );
    this.camera.attachControl(this.trophyCanvas, false);
    this.camera.inputs.clear();
    this.camera.lowerRadiusLimit = 3.8;
    this.camera.upperRadiusLimit = 8.5;

    this.createLights(this.scene);

    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });

    if (!this.resizeBound) {
      window.addEventListener("resize", this.resizeTrophyCanvas);
      this.resizeBound = true;
    }

    window.setTimeout(() => this.resizeTrophyCanvas(), 0);

    try {
      this.awardSound = new BABYLON.Sound(
        "trophyAward",
        "./Audio/SFX/Click-96-k.aac",
        this.scene,
        undefined,
        {
          autoplay: false,
          loop: false,
          volume: 0.6,
        },
      );
    } catch {
      // non-fatal
    }

    if (!this.loadPromise) {
      this.loadPromise = this.loadTrophy(this.scene).catch((err) => {
        console.error("[trophy] failed to load Trophy.glb", err);
      });
    }
  }

  public async showAward(tier: TrophyTier): Promise<void> {
    if (tier === "NONE") {
      this.hideAward();
      return;
    }

    if (!this.scene || !this.engine) return;

    this.resizeTrophyCanvas();

    if (!this.loadPromise) {
      this.loadPromise = this.loadTrophy(this.scene).catch((err) => {
        console.error("[trophy] failed to load Trophy.glb", err);
      });
    }

    await this.loadPromise;
    if (!this.assets || !this.scene) return;

    applyTierMaterial(this.scene, this.assets.meshes, tier, this.tierMaterials);

    this.assets.root.setEnabled(true);
    this.assets.root.rotation.copyFrom(TROPHY_ROT);

    if (this.camera) {
      this.camera.setTarget(TROPHY_STAGE_CAMERA_TARGET);
      this.camera.radius = 5.2;
      this.camera.alpha = BABYLON.Tools.ToRadians(86);
      this.camera.beta = BABYLON.Tools.ToRadians(72);
    }

    this.startSpinBobAnimation(this.scene, this.assets.root);
    burstParticles(this.assets, tier);

    try {
      this.awardSound?.play();
    } catch {}
  }

  public hideAward(): void {
    if (!this.scene || !this.assets) return;

    this.assets.root.setEnabled(false);
    this.assets.particle?.stop();

    if (this.spinObserver) {
      this.scene.onBeforeRenderObservable.remove(this.spinObserver);
      this.spinObserver = null;
    }
  }

  public resizeTrophyCanvas = (): void => {
    if (!this.engine || !this.trophyCanvas) return;

    const rect = this.trophyCanvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    this.engine.resize();
  };

  private createLights(scene: BABYLON.Scene): void {
    const key = new BABYLON.DirectionalLight(
      "trophyKeyLight",
      new BABYLON.Vector3(-0.4, -1, -0.25),
      scene,
    );
    key.intensity = 1.9;

    const fill = new BABYLON.HemisphericLight(
      "trophyFillLight",
      new BABYLON.Vector3(0, 1, 0),
      scene,
    );
    fill.intensity = 0.8;

    const rim = new BABYLON.PointLight(
      "trophyRimLight",
      new BABYLON.Vector3(2.2, 1.8, -1.8),
      scene,
    );
    rim.intensity = 1.1;
  }

  private async loadTrophy(scene: BABYLON.Scene): Promise<void> {
    if (this.assets) return;

    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "./Models/",
      "Trophy.glb",
      scene,
    );

    const root = new BABYLON.TransformNode("trophyRoot", scene);
    root.rotation.copyFrom(TROPHY_ROT);

    const importedMeshes = result.meshes.filter(
      (m) => m.name !== "__root__" && m !== result.meshes[0],
    );

    for (const mesh of importedMeshes) {
      mesh.parent = root;
      mesh.isPickable = false;
      mesh.receiveShadows = false;
    }

    const renderMeshes =
      importedMeshes.length > 0 ? importedMeshes : result.meshes;

    normalizeTrophyRoot(root, renderMeshes);

    const sparkleEmitter = BABYLON.MeshBuilder.CreateSphere(
      "trophySparkEmitter",
      { diameter: 0.2 },
      scene,
    );
    sparkleEmitter.isVisible = false;
    sparkleEmitter.parent = root;
    sparkleEmitter.position = new BABYLON.Vector3(
      0,
      TARGET_TROPHY_HEIGHT * 0.42,
      0,
    );

    const particle = createParticleSystem(scene, sparkleEmitter);

    this.assets = {
      root,
      meshes: renderMeshes,
      sparkleEmitter,
      particle,
    };

    this.assets.root.setEnabled(false);
  }

  private startSpinBobAnimation(
    scene: BABYLON.Scene,
    root: BABYLON.TransformNode,
  ): void {
    if (this.spinObserver) {
      scene.onBeforeRenderObservable.remove(this.spinObserver);
      this.spinObserver = null;
    }

    const startTime = performance.now();
    const baseY = root.position.y;

    this.spinObserver = scene.onBeforeRenderObservable.add(() => {
      const t = (performance.now() - startTime) / 1000;
      root.rotation.y += 0.012;
      root.position.y = baseY + Math.sin(t * 2.4) * 0.08;
    });
  }

  public dispose(): void {
    this.hideAward();

    if (this.resizeBound) {
      window.removeEventListener("resize", this.resizeTrophyCanvas);
      this.resizeBound = false;
    }

    this.awardSound?.dispose();
    this.awardSound = null;

    const tiers: Array<Exclude<TrophyTier, "NONE">> = [
      "BRONZE",
      "SILVER",
      "GOLD",
    ];

    for (const tier of tiers) {
      this.tierMaterials[tier]?.dispose();
    }
    this.tierMaterials = {};

    this.scene?.dispose();
    this.engine?.dispose();

    this.assets = null;
    this.loadPromise = null;
    this.camera = null;
    this.scene = null;
    this.engine = null;
    this.trophyCanvas = null;
  }
}

const trophySystem = new TrophySystem();

export function initTrophySystem(mainScene: BABYLON.Scene): void {
  trophySystem.init(mainScene);
}

export async function showTrophyAward(tier: TrophyTier): Promise<void> {
  await trophySystem.showAward(tier);
}

export function hideTrophyAward(): void {
  trophySystem.hideAward();
}

export function resizeTrophyCanvas(): void {
  trophySystem.resizeTrophyCanvas();
}

export function disposeTrophySystem(): void {
  trophySystem.dispose();
}
