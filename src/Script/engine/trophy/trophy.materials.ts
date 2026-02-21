import { TEXTURE_PATHS } from "../../domain/data/data.consts";
import { TrophyTier } from "../../domain/data/data.types";

export type TrophyMaterialCache = Partial<
  Record<Exclude<TrophyTier, "NONE">, BABYLON.PBRMetallicRoughnessMaterial>
>;

export function applyTierMaterial(
  scene: BABYLON.Scene,
  meshes: BABYLON.AbstractMesh[],
  tier: Exclude<TrophyTier, "NONE">,
  tierMaterials: TrophyMaterialCache,
): void {
  let mat = tierMaterials[tier];

  if (!mat) {
    mat = new BABYLON.PBRMetallicRoughnessMaterial(`trophyPBR_${tier}`, scene);

    if (tier === "GOLD") {
      mat.metallic = 0.9;
      mat.roughness = 0.2;
      mat.baseColor = new BABYLON.Color3(1.0, 0.92, 0.72);
      mat.emissiveColor = new BABYLON.Color3(0.01, 0.008, 0.0);
    } else if (tier === "SILVER") {
      mat.metallic = 0.78;
      mat.roughness = 0.28;
      mat.baseColor = new BABYLON.Color3(0.92, 0.95, 1.0);
      mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    } else {
      mat.metallic = 0.48;
      mat.roughness = 0.5;
      mat.baseColor = new BABYLON.Color3(1.0, 0.96, 0.9);
      mat.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    }

    try {
      const albedoTex = new BABYLON.Texture(
        TEXTURE_PATHS[tier],
        scene,
        true,
        false,
        BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      );

      albedoTex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
      albedoTex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
      albedoTex.hasAlpha = false;
      albedoTex.anisotropicFilteringLevel = 8;

      mat.baseTexture = albedoTex;
    } catch (err) {
      console.warn(`[trophy] failed to load ${tier} texture`, err);
    }

    tierMaterials[tier] = mat;
  }

  for (const mesh of meshes) {
    if (!(mesh instanceof BABYLON.Mesh)) continue;
    if (mesh.getTotalVertices() <= 0) continue;
    mesh.material = mat;
  }
}
