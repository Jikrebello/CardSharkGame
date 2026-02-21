import {
  TARGET_TROPHY_HEIGHT,
  TROPHY_BASE_POS,
  TROPHY_ROT,
} from "../../domain/data/data.consts";

export function normalizeTrophyRoot(
  root: BABYLON.TransformNode,
  meshes: BABYLON.AbstractMesh[],
): void {
  root.computeWorldMatrix(true);
  for (const m of meshes) m.computeWorldMatrix(true);

  let min = new BABYLON.Vector3(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  );
  let max = new BABYLON.Vector3(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  );

  const renderMeshes = meshes.filter(
    (m): m is BABYLON.Mesh =>
      m instanceof BABYLON.Mesh && m.getTotalVertices() > 0,
  );

  if (renderMeshes.length === 0) {
    root.scaling.setAll(1);
    root.position.copyFrom(TROPHY_BASE_POS);
    root.rotation.copyFrom(TROPHY_ROT);
    return;
  }

  for (const mesh of renderMeshes) {
    const bi = mesh.getBoundingInfo();
    min = BABYLON.Vector3.Minimize(min, bi.boundingBox.minimumWorld);
    max = BABYLON.Vector3.Maximize(max, bi.boundingBox.maximumWorld);
  }

  const size = max.subtract(min);
  const center = min.add(max).scale(0.5);

  if (!isFinite(size.y) || size.y <= 0.0001) {
    root.scaling.setAll(1);
    root.position.copyFrom(TROPHY_BASE_POS);
    root.rotation.copyFrom(TROPHY_ROT);
    return;
  }

  const uniformScale = TARGET_TROPHY_HEIGHT / size.y;
  root.scaling.setAll(uniformScale);

  const scaledHeight = size.y * uniformScale;
  const scaledCenterOffsetX = center.x * uniformScale;
  const scaledCenterOffsetY = center.y * uniformScale;
  const scaledCenterOffsetZ = center.z * uniformScale;

  root.position.x = TROPHY_BASE_POS.x - scaledCenterOffsetX;
  root.position.y =
    TROPHY_BASE_POS.y + scaledHeight * 0.5 - scaledCenterOffsetY;
  root.position.z = TROPHY_BASE_POS.z - scaledCenterOffsetZ;

  root.rotation.copyFrom(TROPHY_ROT);
}
