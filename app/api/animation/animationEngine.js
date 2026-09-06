import * as THREE from "three";
import { getPose } from "./poseDictionary.js";

export function createAnimationSequence(glossSequence) {
  return glossSequence.map((gloss) => {
    const pose = getPose(gloss);

    return {
      gloss: gloss.toUpperCase(),
      duration: pose?.duration ?? 500,
      bones: pose?.bones ?? {},
      morphs: pose?.morphs ?? {},
    };
  });
}

export function applyPose(avatar, pose) {
  if (!avatar || !pose) return;

  avatar.traverse((object) => {
    if (!object.isBone) return;

    const rotation = pose.bones[object.name];

    if (rotation) {
      object.rotation.set(
        rotation.x,
        rotation.y,
        rotation.z
      );
    }
  });

  avatar.traverse((object) => {
    if (!object.isMesh || !object.morphTargetDictionary) return;
    if (!object.morphTargetInfluences) return;

    for (const [name, value] of Object.entries(pose.morphs)) {
      const index = object.morphTargetDictionary[name];

      if (index !== undefined) {
        object.morphTargetInfluences[index] = value;
      }
    }
  });
}

export function slerpBone(
  bone,
  targetRotation,
  alpha
) {
  const target = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      targetRotation.x,
      targetRotation.y,
      targetRotation.z,
      "XYZ"
    )
  );

  bone.quaternion.slerp(target, alpha);
}